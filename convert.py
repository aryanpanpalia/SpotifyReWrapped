import pandas as pd

dfs = [pd.read_json(file) for file in ["data/2022_0.json", "data/2023_1.json", "data/2023_2.json"]]
df = pd.concat(dfs, ignore_index=True)

columns = {
    "ts": "DateTime",
    "spotify_track_uri": "URI",
    "master_metadata_album_artist_name": "Artist",
    "master_metadata_album_album_name": "Album",
    "master_metadata_track_name": "Name",
    "ms_played": "Duration",
}

df = df[columns.keys()]
df = df.dropna(how="any")
df = df.rename(columns=columns)

df["Duration"] = df["Duration"].apply(lambda x: x / 1000)
df["URI"] = df["URI"].apply(lambda s: s[14:])
df["Hour"] = df["DateTime"].apply(lambda t: t[11:13])

df.to_csv("data/history.csv", sep=";", index=False)
