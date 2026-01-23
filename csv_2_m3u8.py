import csv
import os
import re
import argparse
from difflib import SequenceMatcher

SUPPORTED_EXTS = [".mp3", ".flac", ".wav", ".m4a", ".ogg"]
MIN_SIMILARITY = 0.60  # reject matches below this

def normalise(text):
    """Normalise text for fuzzy matching."""
    text = text.lower()
    text = re.sub(r'\(.*?\)', '', text)   # remove remaster/remix tags
    text = re.sub(r'[^a-z0-9 ]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

def index_music_files(music_dir):
    """
    Map normalised filename -> full path
    """
    index = {}
    for root, _, files in os.walk(music_dir):
        for file in files:
            name, ext = os.path.splitext(file)
            if ext.lower() in SUPPORTED_EXTS:
                index[normalise(name)] = os.path.join(root, file)
    return index

def find_best_match(track_name, music_index):
    track_key = normalise(track_name)

    best_score = 0.0
    best_path = None

    for name_key, path in music_index.items():
        score = similarity(track_key, name_key)
        if score > best_score:
            best_score = score
            best_path = path

    if best_score >= MIN_SIMILARITY:
        return best_path, best_score

    return None, best_score

def csv_to_m3u8(csv_path, music_index, output_dir):
    playlist_name = os.path.splitext(os.path.basename(csv_path))[0]
    output_path = os.path.join(output_dir, f"{playlist_name}.m3u8")

    total = matched = 0

    with open(csv_path, newline="", encoding="utf-8") as csvfile, \
         open(output_path, "w", encoding="utf-8") as m3u8:

        reader = csv.DictReader(csvfile)
        m3u8.write("#EXTM3U\n")

        for row in reader:
            track = row.get("Track Name")
            if not track:
                continue

            total += 1
            path, score = find_best_match(track, music_index)

            if path:
                matched += 1
                m3u8.write(os.path.relpath(path, output_dir) + "\n")
            else:
                print(f"No good match for: {track} (best={score:.2f})")

    print(f"{playlist_name}: {matched}/{total} tracks matched")

def main():
    parser = argparse.ArgumentParser(
        description="Create M3U8 playlists using best-match fuzzy filename search"
    )
    parser.add_argument("csv_files", nargs="+", help="CSV playlist files")
    parser.add_argument("--source", default="./Music", help="Music directory")
    parser.add_argument("--dest", default="./playlists", help="Playlist output directory")

    args = parser.parse_args()

    music_dir = os.path.abspath(args.source)
    output_dir = os.path.abspath(args.dest)

    os.makedirs(output_dir, exist_ok=True)

    print("Indexing music files...")
    music_index = index_music_files(music_dir)
    print(f"   Indexed {len(music_index)} tracks")

    for csv_file in args.csv_files:
        csv_to_m3u8(csv_file, music_index, output_dir)

if __name__ == "__main__":
    main()
