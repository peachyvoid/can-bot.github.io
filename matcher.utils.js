/**
 * Common non-essential words frequently found in music filenames
 * or streaming metadata that do not meaningfully distinguish tracks.
 *
 * These are stripped during normalisation to improve matching accuracy.
 *
 * @constant {string[]}
 */
const STOPWORDS = [
    "official", "video", "audio",
    "remaster", "remastered",
    "mix", "mono", "stereo",
    "version", "edit", "live",
    "feat", "ft"
];

/**
 * Normalises track titles for fuzzy matching.
 * - Lowercases text
 * - Removes punctuation and bracketed metadata
 * - Strips common junk words (e.g. "remastered", "official")
 *
 * @param {string} text Raw track or filename
 * @returns {string} Normalised string
 */
function normalise(text) {
    text = text
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    for (const w of STOPWORDS) {
        text = text.replace(new RegExp(`\\b${w}\\b`, "g"), "");
    }
    return text.replace(/\s+/g, " ").trim();
}

function scanID3(file) {
    return new Promise((resolve, reject) => {
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                const song = new Song(file.name);
                song.title = tag.tags.title || 'Unknown';
                song.artist = tag.tags.artist || 'Unknown';
                song.album = tag.tags.album || 'Unknown';
                song.genre = tag.tags.genre || 'Unknown';
                resolve(song);
            },
            onError: function (error) {
                console.error('Error reading metadata:', error);
                reject(error);
            }
        });
    });
}