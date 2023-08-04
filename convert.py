import json

history_lists = [json.loads(open(f, 'r', encoding='UTF-8').read()) for f in ["2022_0.json", "2023_1.json", "2023_2.json"]]
history = [item for sublist in history_lists for item in sublist]

with open("history.csv", "w", encoding="UTF-8") as f:
    f.write(f"Date;; Time;; URI;; IP;; Artist;; Album;; Name;; Duration\n")
    for item in history:
        date = item['ts'][:10]
        time = item['ts'][11:-1]
        duration = item['ms_played'] / 1000
        ip = item['ip_addr_decrypted']
        name = item['master_metadata_track_name']
        album = item['master_metadata_album_album_name']
        artist = item['master_metadata_album_artist_name']

        try:
            uri = item['spotify_track_uri'][14:]
        except:
            continue

        f.write(f"{date};; {time};; {uri};; {ip};; {artist};; {album};; {name};; {duration}\n")
