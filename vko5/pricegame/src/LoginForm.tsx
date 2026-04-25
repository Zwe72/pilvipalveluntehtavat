import { useState, type FormEvent } from "react";
import { loginWithEmail, registerWithEmail } from "./authService";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Tuntematon virhe");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      await registerWithEmail(email, password);
    } catch (err: unknown) {
      if (err instanceof Error)  {
        setError(err.message);
      } else {
        setError("Rekisteröinti epäonnistui");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Kirjaudu sisään</h2>

      <div>
        <label>Sähköposti: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Salasana: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Kirjaudutaan..." : "Kirjaudu"}
      </button>

      <button
      type="button"
      onClick={handleRegister}
      disabled={loading}
      style={{ marginLeft: "10px" }}
      >
        Luo käyttäjä
      </button>
    </form>
  );
};

export default LoginForm;