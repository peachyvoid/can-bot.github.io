import { useEffect, useState } from "react";

export function MusicLibrary({ musicFiles, onMusicFilesChange, progress }) {
  const [dirSupported, setDirSupported] = useState(true);

  useEffect(() => {
    const input = document.createElement("input");
    setDirSupported("webkitdirectory" in input);
  }, []);

  return (
    <div className="card">
      <h2>2. Music Library</h2>

      {!dirSupported && (
        <div className="warning">
          Your browser does not support folder selection.
        </div>
      )}

      <label>Select music folder</label>
      <input
        type="file"
        webkitdirectory="true"
        multiple
        onChange={(e) => onMusicFilesChange(Array.from(e.target.files))}
      />

      {musicFiles?.length > 0 && (
        <p className="file-hint">{musicFiles.length} audio file(s) found</p>
      )}

      {progress && (
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{ width: `${progress.percent}%` }}
          />
          <span className="progress-label">
            {progress.percent}% ({progress.done}/{progress.total})
          </span>
        </div>
      )}
    </div>
  );
}
