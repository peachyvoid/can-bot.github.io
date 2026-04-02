import { useEffect, useRef } from "react";

export function GenerateSection({ onGenerate, isRunning, logs }) {
  const logRef = useRef(null);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="card">
      <h2>3. Generate</h2>
      <button onClick={onGenerate} disabled={isRunning} className="generate-btn">
        {isRunning ? (
          <>
            <span className="spinner" />
            Generating…
          </>
        ) : (
          "Generate M3U8 Playlist"
        )}
      </button>

      {logs.length > 0 && (
        <div ref={logRef} className="log">
          {logs.map((line, i) => (
            <LogLine key={i} line={line} />
          ))}
        </div>
      )}
    </div>
  );
}

function LogLine({ line }) {
  const color = line.startsWith("✔")
    ? "var(--success)"
    : line.startsWith("⚠")
    ? "var(--warn)"
    : line.startsWith("✘")
    ? "var(--error)"
    : "inherit";

  return <div style={{ color }}>{line}</div>;
}
