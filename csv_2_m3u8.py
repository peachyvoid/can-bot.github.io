import csv
import os
import re

MUSIC_DIR = "./Music"
OUTPUT_DIR = "./playlists"
SUPPORTED_EXTS = [".mp3", ".flac", ".wav", ".m4a", ".ogg"]

os.makedirs(OUTPUT_DIR, exist_ok=True)

def sanitise(text):
    """Remove characters that commonly break filenames."""
    return re.sub(r'[<>:"/\\|?*]', '', text).strip()

def find_track_file(artist, track):
    artist = sanitise(artist)
    track = sanitise(track)

    for ext in SUPPORTED_EXTS:
        filename = f"{track}{ext}"
        path = os.path.join(MUSIC_DIR, filename)
        if os.path.exists(path):
            return path

    return None

def csv_to_m3u8(csv_path):
    playlist_name = os.path.splitext(os.path.basename(csv_path))[0]
    output_path = os.path.join(OUTPUT_DIR, f"{playlist_name}.m3u8")

    missing = 0

    with open(csv_path, newline="", encoding="utf-8") as csvfile, \
         open(output_path, "w", encoding="utf-8") as m3u8:

        reader = csv.DictReader(csvfile)
        m3u8.write("#EXTM3U\n")

        for row in reader:
            track = row.get("Track Name")
            artist = row.get("Artist Name(s)")

            if not track or not artist:
                continue

            path = find_track_file(artist, track)
            if path:
                m3u8.write(path + "\n")
            else:
                missing += 1

    print(f"Created: {output_path}")
    print(f"Missing tracks: {missing}")

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python csv_to_m3u8.py playlist1.csv playlist2.csv ...")
        sys.exit(1)

    for csv_file in sys.argv[1:]:
        csv_to_m3u8(csv_file)
