const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function predict(payload) {
  const res = await fetch(`${API}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Prediction failed");
  return data;
}
