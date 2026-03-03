export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>✅ Работает!</h1>
      <p>Это страница с Vercel.</p>
      <p>Время сборки: {new Date().toISOString()}</p>
    </main>
  );
}