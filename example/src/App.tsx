import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function synthesize() {
    const res = await fetch('/v1/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'openai', text })
    });
    const data = await res.json();
    setAudioUrl(data.audioUrl);
  }

  return (
    <div>
      <h1>LiteTTS Demo</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={synthesize}>Speak</button>
      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  );
}
