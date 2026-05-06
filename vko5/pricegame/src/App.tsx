import { useState, useEffect } from 'react'
import './App.css'

import LoginForm from './LoginForm';
import { auth, logout } from './authService';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { RoundResult } from './components/RoundResult';
import { QuizForm } from './components/QuizForm';

import { subscribeSession, updatePlayerGuess, joinSession} from './services/gameSessionService';
import { type Session } from './types/Session';

import { createSession } from './services/gameSessionService';
import { startGame, nextRound } from './gameController';

import ConsentBanner from "./components/ConsentBanner";

import RouteAnalytics from './components/RouteAnalytics';

function App() {
  
  const [session, setSession] = useState<Session | null>(null);
  const [codename, setCodename] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showAnalyticsInfo, setShowAnalyticsInfo] = useState(false);
  const sessionId = "pWQ8TndPALsYnoIIPahC";

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);

      if (!firebaseUser) return;
        
      const name = firebaseUser.email ?? "Player";
      setCodename(name);

      await joinSession(sessionId, {
      uid: firebaseUser.uid,
      codename: name,
      score: 0,
      guess: null
    });
    
      await createSession(sessionId);

      const unsubscribeSession = subscribeSession(sessionId, (data) => {
      console.log("🔥 FIRESTORE DATA:", data);

      if (!data) {
        console.error("❌ Session document ei löydy!");
        return;
      }
      setSession(data);
    });

    return () => {
      unsubscribeSession?.();
    };
    });

    return () => {
      unsubscribeAuth();
    };   
  }, []);

  useEffect(() => {
    if (!session) return;

    if (session.status === "waiting" && session.players.length >= 1) {
      startGame(session);
    }
  }, [session]);

  useEffect(() => {
    const consent = localStorage.getItem("consent");

    if (consent === "true") {
      if (!document.querySelector('script[src*="cloudflareinsights"]')) {
        const script = document.createElement("script");
        script.src = "https://static.cloudflareinsights.com/beacon.min.js";
        script.defer = true;
        script.setAttribute(
          "data-cf-beacon",
          '{"token": "a2eaacc5bb1d4cf48e0a8bbfec5e339e"}'
        );
        document.body.appendChild(script);
      }
    }
  }, []);

  async function submitGuess(guess: number) {
    if (!session || !user) return;
    if (!session.currentProduct) return;
    if (session.status !== "playing") return;
    

    await updatePlayerGuess(session.id, user.uid, guess);
  }

  async function resetRound() {
  if (!session) return;
  await nextRound(session);
  }
    if (showAnalyticsInfo) {
      return (
        <div>
          <button onClick={() => setShowAnalyticsInfo(false)}>
            Takaisin
          </button>

          <h2>Analytiikan hyödyntäminen</h2>

          <p className="space">
          Web-analytiikka tarkoittaa käytännössä sitä, että seurataan ja analysoidaan,
          miten käyttäjät toimivat verkkosivustolla tai sovelluksessa. Siihen kuuluu datan kerääminen, 
          tarkastelu ja raportointi siitä, miten käyttäjät käyttävät sivuston eri osia, kuten sivuja, kuvia ja videoita. 
          Tavoitteena on saada selkeä kuva siitä, mikä toimii ja mikä ei. Näiden tietojen avulla sivustoa voidaan kehittää 
          paremmin käyttäjien tarpeisiin sopivaksi, mutta samalla myös tukea liiketoimintaa. Esimerkiksi kasvattamalla kävijämääriä, myyntiä tai liikevaihtoa.
          </p>

          <p className="space">
          Analytiikka voi kertoa monia hyödyllisiä asioita, kuten mistä käyttäjät tulevat sivustolle, mitä sivuja he katsovat, kuinka kauan he viipyvät ja missä kohtaa he poistuvat. 
          Lisäksi voidaan nähdä, ketkä ovat uusia kävijöitä ja ketkä palaavat takaisin. Näiden tietojen avulla on helpompi ymmärtää käyttäjien käyttäytymistä ja sitä, 
          millainen sisältö tai ominaisuudet kiinnostavat eniten. 
          </p>
          <p className="space">
          On myös tärkeää ymmärtää, että analytiikka ei ole pelkkää datan keräämistä. 
          Siihen kuuluu myös tavoitteiden asettaminen, tärkeiden mittareiden (KPI) valinta ja datan hyödyntäminen. Esimerkiksi A/B-testauksen avulla voidaan vertailla kahta eri versiota ja katsoa, 
          kumpi toimii paremmin. Tämän kaiken avulla voidaan tehdä parempia päätöksiä liittyen sisältöön, markkinointiin ja koko sivuston toimivuuteen.
          </p>

        </div>
      );
    }

    if (loadingUser) return <p>Ladataan käyttäjää...</p>;
    if (!user) {
      return (
        <div>
          <ConsentBanner />
          <RouteAnalytics />

          <LoginForm />

          <button onClick={() => setShowAnalyticsInfo(true)}>
            📊 Analytics info
          </button>
        </div>
      );
    }
    if (!session) return <p>⚠️ Session ei latautunut</p>;

  const currentPlayer = session.players?.find(p => p.uid === user.uid);
  const hasGuessed = currentPlayer?.guess != null;

  return (
    <div>
      <ConsentBanner />
      <RouteAnalytics />

      <p>👋 Tervetuloa, {codename}</p>
      <button onClick={logout}>Kirjaudu ulos</button>

      {session.status === "playing" && !hasGuessed && (
        <QuizForm
        onSubmitGuess={submitGuess}
        players={session.players ?? []}
        currentUserId={user.uid}
        productName={session.currentProduct?.title ?? ""}
        />
      )}

      {session.status === "playing" && hasGuessed && (
        <p>⏳ Odotetaan muita pelaajia vastaamaan...</p>
      )}

      {session.status === "finished" && session.correctPrice != null && (
        <>
        <RoundResult
        players={session.players}
        correctPrice={session.correctPrice}
        />

        <button onClick={resetRound}>
          🔄 Uusi kierros
        </button>
        </>
      )}

      <button onClick={() => setShowAnalyticsInfo(true)}>
        📊 Analytics info
      </button>
    </div>
  );
}

export default App;
