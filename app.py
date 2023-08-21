from flask import Flask, request, jsonify
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.dates import date2num
from matplotlib.ticker import MaxNLocator
import os
import shutil
from flask_cors import CORS
import matplotlib

matplotlib.use('agg')

app = Flask("SpotifyData")
CORS(app)

data = pd.read_csv("data/history.csv", sep=";", engine="python")
data["DateTime"] = pd.to_datetime(data.DateTime)

sns.color_palette("deep")
color = "green"

@app.route('/register', methods=['POST'])
def register():
    form = request.form
    username = form.get("username")
    password = form.get("password")

    users = pd.read_csv("users.csv", engine="python")

    if username in users["Username"].values:
        return jsonify({"success": False})

    with open("users.csv", "a") as f:
        f.write(f"{username},{password}\n")

    return jsonify({"success": True})

@app.route('/login', methods=['POST'])
def login():
    form = request.form
    username = form.get("username")
    password = form.get("password")

    users = pd.read_csv("users.csv", dtype=str)
    userInfo = users[users["Username"] == username]

    if not len(userInfo):
        return jsonify({"success": False})

    if password not in userInfo["Password"].values:
        return jsonify({"success": False})

    return jsonify({"success": True})

@app.route('/upload', methods=['POST'])
def upload():
    files = request.files    
    username = request.form.get("username")

    folder = f"data/{username}"

    if os.path.isdir(folder):
        shutil.rmtree(folder)

    os.mkdir(folder)

    for key in files:
        files[key].save(f"{folder}/{key}.json")
        
    return jsonify({"success": True})

@app.route('/overall', methods=['GET'])
def getOverall():
    args = request.args

    startDate = args.get("startDate")
    endDate = args.get("endDate")
    metrics = args.getlist("metrics")

    folder = startDate.replace("-", "") + "-" + endDate.replace("-", "")
    os.makedirs(f"static/images/{folder}", exist_ok=True)

    startDate = pd.to_datetime(startDate).tz_localize("utc")
    endDate = pd.to_datetime(endDate).tz_localize("utc")

    plotFunctions = {
        "totalTimeSpentListening": getTimeSpentListening, 
        "totalSongsPlayed": getNumSongsPlayed,
        "mostListenedToSongsDuration": getMostListenedToSongsByDuration,
        "mostListenedToSongsOccurences": getMostListenedToSongsByOccurences,
        "mostListenedToArtistsDuration": getMostListenedToArtistsByDuration,
        "mostListenedToArtistsOccurences": getMostListenedToArtistsByOccurences,
        "timeOfDay": getTimeOfDaySpentListening
    }

    for metric in metrics:
        if f"{metric}.png" not in os.listdir(f"static/images/{folder}"):
            plt.figure(figsize=(16,8), dpi=200)
            plot = plotFunctions[metric](startDate, endDate)
            imagePath = f"static/images/{folder}/{metric}.png"
            plot.get_figure().savefig(imagePath, bbox_inches="tight")
            plt.clf()

    return jsonify({"imageURLs": [f"static/images/{folder}/{metric}.png" for metric in metrics]})

def getTimeSpentListening(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()
    totalTime = slice["Duration"].sum()

    slice["Duration"] /= 60
    totalTime //= 60
    unit = "min"

    if totalTime > 1440:
        slice["Duration"] /= 60
        totalTime //= 60
        unit = "hour"

    numDays = (end.date() - start.date()).days
    
    # Hacked around in C:\Users\Aryan\Programming\SpotifyData\venv\Lib\site-packages\seaborn\distributions.py to make this work
    # Used ARYAN_CUSTOM_COND = estimate_kws["bins"] == "auto" if len(estimate_kws["bins"]) == 1 else "auto" in estimate_kws["bins"]
    if numDays >= 7:
        plot = sns.histplot(slice, x="DateTime", weights="Duration", bins=date2num(pd.date_range(start=start, end=end, periods=50)), color=color, alpha=1)
        plt.xticks(pd.date_range(start=start, end=end, periods=50), minor=True)
        plt.xticks(pd.date_range(start=start, end=end, periods=8))
    else:
        plot = sns.histplot(slice, x="DateTime", weights="Duration", bins=date2num(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="3H")), color=color, alpha=1)
        plt.xticks(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="3H"), minor=True)
        plt.xticks(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="24H"))
    
    plot.set_title(f'Time Spent Listening to Songs between {start.date()} and {end.date()} (Total: {int(totalTime)} {unit}s)')
    plot.set_ylabel(f'Duration ({unit})')

    return plot

def getNumSongsPlayed(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    numSongs = len(slice["Duration"])
    numDays = (end.date() - start.date()).days
    
    if numDays >= 7:
        plot = sns.histplot(slice, x="DateTime", bins=date2num(pd.date_range(start=start, end=end, periods=50)), color=color, alpha=1)
        plt.xticks(pd.date_range(start=start, end=end, periods=50), minor=True)
        plt.xticks(pd.date_range(start=start, end=end, periods=8))
    else:
        plot = sns.histplot(slice, x="DateTime", bins=date2num(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="3H")), color=color, alpha=1)
        plt.xticks(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="3H"), minor=True)
        plt.xticks(start + pd.timedelta_range(start="0 days", end=f"{numDays} days", freq="24H"))
    
    plot.set_title(f'Number of Songs Played between {start.date()} and {end.date()} (Total: {numSongs} songs)')
    plot.set_ylabel('Count')
    
    return plot

def getMostListenedToSongsByDuration(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    mostListenedTo = slice.groupby("Name")["Duration"].sum().sort_values()[-25:].reset_index()
    
    mostListenedTo["Duration"] /= 60
    unit = "min"

    if any(mostListenedTo["Duration"] > 600):
        mostListenedTo["Duration"] /= 60
        unit = "hour"

    plot = sns.barplot(mostListenedTo, x="Duration", y="Name", color=color, saturation=1)
    plot.set_title(f'Most Listened To Songs between {start.date()} and {end.date()} (Duration)')
    plot.set_xlabel(f'Duration ({unit})')
    plot.set_ylabel('')

    return plot

def getMostListenedToSongsByOccurences(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    mostListenedTo = slice["Name"].value_counts().sort_values()[-25:].reset_index()

    plot = sns.barplot(mostListenedTo, x="count", y="Name", color=color, saturation=1)
    plot.set_title(f'Most Listened To Songs between {start.date()} and {end.date()} (Occurences)')
    plot.set_xlabel('Count')
    plot.set_ylabel('')

    return plot

def getMostListenedToArtistsByDuration(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    mostListenedTo = slice.groupby("Artist")["Duration"].sum().sort_values()[-25:].reset_index()

    mostListenedTo["Duration"] /= 60
    unit = "min"

    if any(mostListenedTo["Duration"] > 600):
        mostListenedTo["Duration"] /= 60
        unit = "hour"

    plot = sns.barplot(mostListenedTo, x="Duration", y="Artist", color=color, saturation=1)
    plot.set_title(f'Most Listened To Artists between {start.date()} and {end.date()} (Duration)')
    plot.set_xlabel(f'Duration ({unit})')
    plot.set_ylabel('')

    return plot

def getMostListenedToArtistsByOccurences(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    mostListenedTo = slice["Artist"].value_counts().sort_values()[-25:].reset_index()

    plot = sns.barplot(mostListenedTo, x="count", y="Artist", color=color, saturation=1)
    plot.set_title(f'Most Listened To Artists between {start.date()} and {end.date()} (Occurences)')
    plot.set_xlabel('Count')
    plot.set_ylabel('')

    return plot

def getTimeOfDaySpentListening(start, end):
    slice = data[(start <= data.DateTime) & (data.DateTime < end)].copy()

    plot = sns.histplot(slice, x=(slice["Hour"] - 9) % 24, bins=range(25), color=color, alpha=1)
    plot.set_title(f'Hour Distribution of Listening between {start.date()} and {end.date()}')
    plot.set_ylabel('Count')
    plot.yaxis.set_major_locator(MaxNLocator(integer=True))
    plt.xticks([hour for hour in range(25)], [hourToLabel((hour + 9) % 24) for hour in range(25)])

    return plot

def hourToLabel(hour):
    if hour == 0:
        return "12AM"
    elif hour < 12:
        return f"{hour}AM"
    elif hour == 12:
        return "12PM"
    else:
        return f"{hour % 12}PM"

@app.route('/artists', methods=['GET'])
def getArtists():
    playedMoreThanTwice = data["Artist"].value_counts().reset_index()
    playedMoreThanTwice = playedMoreThanTwice[playedMoreThanTwice["count"] > 2]

    slice = data.groupby("Artist")["Duration"].sum().sort_values().reset_index()
    slice = slice[(slice["Duration"] > 60) & slice["Artist"].isin(playedMoreThanTwice["Artist"])]

    artists = sorted(slice["Artist"].unique().tolist(), key=str.lower)

    return jsonify({"artists": artists})

@app.route('/artistHistory', methods=['GET'])
def getArtistHistory():
    artists = request.args.getlist("artists")

    folder = "".join(artist.replace(" ", "") for artist in artists)
    imagePath = f"static/images/{folder}/ArtistHistory.png"
    os.makedirs(f"static/images/{folder}", exist_ok=True)

    if not os.listdir(f"static/images/{folder}"):
        slice = data.groupby([pd.Grouper(key="DateTime", freq="2W"), "Artist"], as_index=False)["Duration"].sum()
        slice = slice[slice["Artist"].isin(artists)]

        slice["Duration"] /= 60
        unit = "min"

        plt.figure(figsize=(16,8), dpi=200)
        if len(slice) > 1:
            plot = sns.histplot(slice, x="DateTime", weights="Duration", hue="Artist", multiple="dodge", binwidth=14, color=color)
        else:
            plot = sns.histplot(slice, x="DateTime", weights="Duration", hue="Artist", multiple="dodge")
        
        plot.set_title(f'Artist History')
        plot.set_ylabel(f'Duration ({unit})')
        plot.get_figure().savefig(imagePath, bbox_inches="tight")
        plt.clf()

    return jsonify({"imageURL": imagePath})

@app.route('/songs', methods=['GET'])
def getSongs():
    playedMoreThanTwice = data["Name"].value_counts().reset_index()
    playedMoreThanTwice = playedMoreThanTwice[playedMoreThanTwice["count"] > 2]

    slice = data.groupby("Name")["Duration"].sum().sort_values().reset_index()
    slice = slice[(slice["Duration"] > 60) & slice["Name"].isin(playedMoreThanTwice["Name"])]

    songs = sorted(slice["Name"].unique().tolist(), key=str.lower)

    name2uri = data.groupby("Name")["URI"].agg("first").to_dict()

    return jsonify({"songs": songs, "name2uri": name2uri})

@app.route('/songHistory', methods=['GET'])
def getSongHistory():
    uris = request.args.getlist("uris")
    uri2name = data.groupby("URI")["Name"].agg("first")
    songs = [uri2name[uri] for uri in uris]

    folder = "".join(uri + "_" for uri in uris)
    imagePath = f"static/images/{folder}/SongHistory.png"
    os.makedirs(f"static/images/{folder}", exist_ok=True)

    if not os.listdir(f"static/images/{folder}"):
        slice = data.groupby([pd.Grouper(key="DateTime", freq="2W"), "Name"], as_index=False)["Duration"].sum()
        slice = slice[slice["Name"].isin(songs)]

        slice["Duration"] /= 60
        unit = "min"

        plt.figure(figsize=(16,8), dpi=200)
        if len(slice) > 1:
            plot = sns.histplot(slice, x="DateTime", weights="Duration", hue="Name", multiple="dodge", binwidth=14)
        else:
            plot = sns.histplot(slice, x="DateTime", weights="Duration", hue="Name", multiple="dodge")

        plot.set_title(f'Song History')
        plot.set_ylabel(f'Duration ({unit})')
        plot.get_figure().savefig(imagePath, bbox_inches="tight")
        plt.clf()

    return jsonify({"imageURL": imagePath})

if __name__ == "__main__":
    app.run(debug=True)