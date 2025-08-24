"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [log, setLog] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [log, loading]);

  // Send handler
  const send = useCallback(async () => {
    const message = msg.trim();
    if (!message || loading) return;

    setLog((l) => [...l, { who: "user", text: message, ts: Date.now() }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      // robust parse in case server returns html
      const ct = res.headers.get("content-type") || "";
      const bodyText = await res.text();
      const data = ct.includes("application/json")
        ? JSON.parse(bodyText)
        : { error: bodyText };

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      setLog((l) => [...l, { who: "bot", text: data.reply || "(empty reply)", ts: Date.now() }]);
    } catch (err) {
      setLog((l) => [...l, { who: "bot", text: `Error: ${err.message}`, ts: Date.now() }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [msg, loading]);

  // Enter to send (Shift+Enter for newline)
  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="wrap">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand">
          <div className="logo">IG</div>
          <div>
            <div className="title">IshaqGPT</div>
            <div className="subtitle">fast • minimal • OpenRouter</div>
          </div>
        </div>
        <div className="actions">
          <a className="pill" href="#" onClick={(e)=>e.preventDefault()}>deepseek/deepseek-r1-0528-qwen3-8b:free</a>
        </div>
      </header>

      {/* CHAT LIST */}
      <main className="chatArea" ref={listRef}>
        {log.length === 0 && (
          <div className="empty">
            <h2>Welcome to IshaqGPT</h2>
            <p>Ask anything to get started.</p>
            <div className="tips">
              <span className="tip">What is the meaning of life?</span>
              <span className="tip">Explain stress testing in software</span>
              <span className="tip">Give me 3 ideas for a portfolio</span>
            </div>
          </div>
        )}

        {log.map((m, i) => (
          <Message key={m.ts + "_" + i} who={m.who} text={m.text} />
        ))}

        {loading && (
          <Message who="bot" text="…" typing />
        )}
      </main>

      {/* INPUT DOCK */}
      <footer className="composer">
        <textarea
          ref={textareaRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message IshaqGPT…"
          rows={1}
        />
        <button onClick={send} disabled={loading || !msg.trim()}>
          {loading ? "Sending…" : "Send"}
        </button>
        <div className="hint">Shift + Enter for new line</div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        :global(html, body) {
          height: 100%;
          background: #0b0c0f; /* deep charcoal */
          color: #e7e9ee;
        }
        .wrap {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(10px);
          background: rgba(12, 13, 17, 0.7);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .logo {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #5ad, #6f9);
          color: #020203;
          font-weight: 800;
          border-radius: 10px;
        }
        .title {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: .2px;
        }
        .subtitle {
          font-size: 12px;
          opacity: 0.65;
        }
        .actions .pill {
          display: inline-block;
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          text-decoration: none;
          color: #b9c3d6;
          font-size: 12px;
          background: rgba(255,255,255,0.03);
        }
        .chatArea {
          padding: 18px 16px 90px;
          overflow-y: auto;
        }
        .empty {
          margin: 8vh auto;
          max-width: 680px;
          text-align: center;
          opacity: 0.9;
        }
        .empty h2 {
          margin: 0 0 8px;
          font-size: 28px;
        }
        .tips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 14px;
        }
        .tip {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 6px 10px;
          font-size: 13px;
          background: rgba(255,255,255,0.04);
          cursor: default;
        }
        .composer {
          position: sticky;
          bottom: 0;
          background: linear-gradient(180deg, rgba(11,12,15,0), rgba(11,12,15,0.85) 25%, #0b0c0f 60%);
          padding: 16px 16px 22px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: end;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .composer textarea {
          width: 100%;
          resize: none;
          max-height: 180px;
          border: 1px solid rgba(255,255,255,0.08);
          outline: none;
          background: rgba(255,255,255,0.04);
          color: #e7e9ee;
          border-radius: 14px;
          padding: 12px 14px;
          line-height: 1.35;
          font-family: inherit;
          font-size: 15px;
        }
        .composer textarea::placeholder {
          color: #98a2b3;
        }
        .composer button {
          height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          border: 0;
          font-weight: 700;
          color: #0b0c0f;
          background: linear-gradient(135deg, #83f, #3cf);
          cursor: pointer;
        }
        .composer button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .hint {
          grid-column: 1 / -1;
          justify-self: center;
          font-size: 12px;
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
}

/** Single message bubble with avatar + typing dots */
function Message({ who, text, typing }) {
  return (
    <div className={`msg ${who}`}>
      <div className="avatar">{who === "user" ? "U" : "IG"}</div>
      <div className="bubble">
        {typing ? <TypingDots /> : text}
      </div>

      <style jsx>{`
        .msg {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 10px;
          margin: 10px auto;
          max-width: 900px;
        }
        .msg.user { direction: rtl; }  /* quick mirror so user's bubble aligns opposite */
        .msg.user .avatar { background: #7fb3ff; color: #0b0c0f; }
        .msg.bot  .avatar { background: #a0ffd1; color: #0b0c0f; }

        .avatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          font-weight: 800;
        }
        .bubble {
          padding: 12px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        .msg.user .bubble { background: rgba(127,179,255,0.12); }
        .msg.bot  .bubble { background: rgba(160,255,209,0.10); }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />

      <style jsx>{`
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 5px;
          border-radius: 50%;
          background: #cbd5e1;
          animation: blink 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: .15s; }
        .dot:nth-child(3) { animation-delay: .3s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: .2; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </>
  );
}
