import { useState, useEffect } from "react";

/* ── Styles injected once ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #ede8df;
    font-family: 'Geist', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 660px;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 30px 90px rgba(0,0,0,.16);
  }

  @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

  .card { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .card-a { background: #4338ca; }
  .card-b { background: #ea4c1a; }

  .tag {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    letter-spacing: .08em;
    text-transform: uppercase;
    display: flex; align-items: center; gap: 7px;
    color: rgba(255,255,255,.45);
  }

  .tdot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .tdot.live { color: #fff; animation: blink 1s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:.25} }

  .cnum {
    font-family: 'Instrument Serif', serif;
    font-size: 92px; line-height: 1;
    letter-spacing: -3px; font-style: italic;
    color: #fff; transition: color .2s;
  }
  .cnum.neg { color: #ffd166; }
  .cnum.hi  { color: #6ee7b7; }
  .clabel { font-family: 'Geist Mono', monospace; font-size: 11px; color: rgba(255,255,255,.35); margin-top: 5px; }

  .ctrls { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; }

  .btn {
    font-family: 'Geist', sans-serif; font-size: 13px;
    padding: 9px 12px; border-radius: 10px; cursor: pointer;
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.12);
    color: #fff; transition: background .12s, transform .07s;
  }
  .btn:hover  { background: rgba(255,255,255,.22); }
  .btn:active { transform: scale(.97); }

  .btn-ghost {
    border-color: transparent; background: transparent;
    font-family: 'Geist Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,.28);
  }
  .btn-ghost:hover { background: transparent; color: rgba(255,255,255,.55); }

  .btn-full {
    width: 100%; padding: 10px;
    border-radius: 10px; cursor: pointer;
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.22);
    color: #fff; font-family: 'Geist', sans-serif;
    font-size: 13px; font-weight: 500;
    transition: background .12s, transform .07s;
  }
  .btn-full:hover    { background: rgba(255,255,255,.25); }
  .btn-full:active   { transform: scale(.97); }
  .btn-full:disabled { opacity: .35; cursor: default; transform: none; }

  .joke-area { flex: 1; min-height: 96px; display: flex; flex-direction: column; justify-content: center; gap: .75rem; }
  .jsetup  { font-family: 'Instrument Serif', serif; font-size: 18px; line-height: 1.5; color: #fff; font-style: italic; }
  .jpunch  { font-size: 13px; color: rgba(255,220,200,.65); padding-left: 12px; border-left: 2px solid rgba(255,255,255,.22); line-height: 1.5; }

  .dots { display: flex; gap: 5px; align-items: center; height: 36px; }
  .d { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.3); animation: bl 1.3s ease-in-out infinite; }
  .d:nth-child(2){animation-delay:.2s}.d:nth-child(3){animation-delay:.4s}
  @keyframes bl { 0%,100%{opacity:.2;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }

  .jtotal { font-family: 'Geist Mono', monospace; font-size: 11px; color: rgba(255,255,255,.28); text-align: right; }

  .snip {
    font-family: 'Geist Mono', monospace; font-size: 11px;
    background: rgba(0,0,0,.18); border-radius: 8px;
    padding: .55rem .85rem; overflow-x: auto; white-space: nowrap;
    color: rgba(255,255,255,.4);
  }
  .kw  { color: #c4b5fd; }
  .fn  { color: #93c5fd; }
  .num { color: #fde68a; }
`;

function Counter() {
  const [count, setCount] = useState(0);
  const cls = count < 0 ? "cnum neg" : count > 9 ? "cnum hi" : "cnum";

  return (
    <div className="card card-a">
      <div className="tag"><span className="tdot" />useState</div>

      <div>
        <div className={cls}>{count}</div>
        <div className="clabel">current count</div>
      </div>

      <div className="ctrls">
        <button className="btn" onClick={() => setCount(c => c - 1)}>− dec</button>
        <button className="btn btn-ghost" onClick={() => setCount(0)}>reset</button>
        <button className="btn" onClick={() => setCount(c => c + 1)}>inc +</button>
      </div>

      <code className="snip">
        <span className="kw">const</span> [count, setCount] ={" "}
        <span className="fn">useState</span>(<span className="num">0</span>)
      </code>
    </div>
  );
}

function JokeFetcher() {
  const [joke, setJoke]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal]   = useState(0);

  const fetchJoke = async () => {
    setLoading(true);
    setJoke(null);
    try {
      const res  = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await res.json();
      setJoke(data);
    } catch {
      setJoke({ setup: "Why did the fetch fail?", punchline: "CORS reasons." });
    }
    setLoading(false);
    setTotal(n => n + 1);
  };

  useEffect(() => { fetchJoke(); }, []);

  return (
    <div className="card card-b">
      <div className="tag">
        <span className={`tdot${loading ? " live" : ""}`} />
        useEffect + fetch
      </div>

      <div className="joke-area">
        {loading
          ? <div className="dots"><span className="d"/><span className="d"/><span className="d"/></div>
          : joke && <>
              <p className="jsetup">{joke.setup}</p>
              <p className="jpunch">{joke.punchline}</p>
            </>
        }
      </div>

      <button className="btn-full" onClick={fetchJoke} disabled={loading}>
        {loading ? "loading…" : "next joke"}
      </button>

      {total > 0 && <span className="jtotal">{total} loaded</span>}

      <code className="snip">
        <span className="fn">useEffect</span>
        {"(() => { "}<span className="fn">fetch</span>{"Joke() }, [])"}
      </code>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{css}</style>
      <div className="grid">
        <Counter />
        <JokeFetcher />
      </div>
    </>
  );
}