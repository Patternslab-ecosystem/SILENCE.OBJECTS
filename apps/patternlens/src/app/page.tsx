export default function Home() {
  return (
    <div style={{ color: 'white', padding: 40, background: '#0a0a0f', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>PatternLens</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>App is running. Middleware disabled for testing.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: 8 }}><a href="/login" style={{ color: '#06b6d4' }}>Login</a></li>
        <li style={{ marginBottom: 8 }}><a href="/dashboard" style={{ color: '#06b6d4' }}>Dashboard</a></li>
        <li style={{ marginBottom: 8 }}><a href="/support" style={{ color: '#06b6d4' }}>Support</a></li>
        <li style={{ marginBottom: 8 }}><a href="/test-supabase" style={{ color: '#06b6d4' }}>Test Supabase</a></li>
      </ul>
    </div>
  );
}
