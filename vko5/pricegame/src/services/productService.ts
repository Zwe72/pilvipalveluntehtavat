export async function fetchRandomProduct() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  const products = data.products;
  return products[Math.floor(Math.random() * products.length)];
}