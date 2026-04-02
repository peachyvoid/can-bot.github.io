# M3U8 Maker

A browser-based .m3u8 playlist generator built with **React + Vite**.

All processing happens locally — no data is uploaded to any server.

## Project Structure

```
src/
├── components/
│   ├── ErrorBanner.jsx      # Dismissible error notification
│   ├── PlaylistSource.jsx   # Mode switcher: Spotify / CSV / Directory
│   ├── MusicLibrary.jsx     # Music folder picker + progress bar
│   └── GenerateSection.jsx  # Generate button + colourised log output
├── hooks/
│   └── useGenerator.js      # All generation logic as a React hook
├── lib/
│   ├── matcherUtils.js      # normalise(), STOPWORDS, MIN_SIMILARITY
│   ├── Song.js              # Audio file model + ID3 tag loading
│   ├── MDatabase.js         # Batched ingestion + bucket index
│   ├── Playlist.js          # CSV/Spotify/dir parsing + M3U8 output
│   └── SpotifyPlaylistFetch.js  # PKCE OAuth + playlist fetch
├── workers/
│   └── matcher.worker.js    # Fuzzy matching (runs off the main thread)
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build
npm run preview
```

## Spotify Setup

Replace the `SPOTIFY_CLIENT_ID` constant in `src/App.jsx` with your own
[Spotify Developer](https://developer.spotify.com/dashboard) app credentials,
and add your redirect URI (e.g. `http://localhost:5173`) to the app's
**Redirect URIs** list in the Spotify dashboard.

## Key architectural changes vs the vanilla build

| Concern | Before | After |
|---|---|---|
| Module system | `<script>` tags, globals | ES modules, `import/export` |
| UI | Vanilla DOM manipulation | React components + hooks |
| State | Scattered globals | `useState` / `useCallback` in `App` + `useGenerator` hook |
| Worker import | Hard-coded path string | Vite `?worker` typed import |
| Normalisation | Duplicated in two files | Single source of truth in `matcherUtils.js` |
| CSS | Inline `<style>` block | Dedicated `index.css` with component classes |
