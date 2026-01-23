const SUPPORTED_EXTS = [".mp3", ".flac", ".wav", ".m4a", ".ogg"];
const MIN_SIMILARITY = 0.60;

function log(msg) {
    document.getElementById("log").textContent += msg + "\n";
}

function getMusicFilesFromDirectory(fileList) {
    return Array.from(fileList)
        .map(f => f.webkitRelativePath || f.name)
        .filter(name =>
            SUPPORTED_EXTS.some(ext => name.toLowerCase().endsWith(ext))
        );
}
  

function normalise(text) {
    return text
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function similarity(a, b) {
    let matches = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) matches++;
    }
    return matches / len;
}

function findBestMatch(track, files) {
    const key = normalise(track);
    let bestScore = 0;
    let bestFile = null;

    for (const file of files) {
        const name = normalise(file.replace(/\.[^.]+$/, ""));
        const score = similarity(key, name);
        if (score > bestScore) {
            bestScore = score;
            bestFile = file;
        }
    }

    return bestScore >= MIN_SIMILARITY ? bestFile : null;
}

function generate() {
    const csvFile = document.getElementById("csvFile").files[0];
    const musicFilesInput = document.getElementById("musicDir").files;
    const rockboxRoot = document.getElementById("rockboxRoot").value;

    if (!csvFile || !musicFilesInput.length) {
        alert("Upload CSV and select a music directory.");
        return;
    }

    const musicFiles = getMusicFilesFromDirectory(musicFilesInput);

    csvFile.text().then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        let output = "#EXTM3U\n";
        let matched = 0;

        parsed.data.forEach(row => {
            const track = row["Track Name"];
            if (!track) return;

            const match = findBestMatch(track, musicFiles);
            if (match) {
                output += `${rockboxRoot}/${match}\n`;
                matched++;
            } else {
                log(`No match: ${track}`);
            }
        });

        log(`Matched ${matched}/${parsed.data.length}`);

        const blob = new Blob([output], { type: "audio/x-mpegurl" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "playlist.m3u8";
        a.click();
    });
}
  
