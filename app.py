from flask import Flask, render_template, url_for, request, redirect
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.dates import date2num
from matplotlib.ticker import MaxNLocator
import os

app = Flask("SpotifyData")

data = pd.read_csv("data/history.csv", sep=";; ", engine="python")

data["DateTime"] = data.Date + "T" + data.Time + "Z"
data["Date"] = pd.to_datetime(data.Date)
data["DateTime"] = pd.to_datetime(data.DateTime)
data["Hour"] = data.apply(lambda row: int(row["Time"][:2]), axis=1)

sns.color_palette("deep")
color = "green"

@app.route('/', methods=['POST', 'GET'])
def home():
    if request.method == "GET":
        return render_template("index.html")
    else:
        form = request.form

        startDate = form.get("startDate")
        endDate = form.get("endDate")
        metrics = form.getlist("metric")

        folder = startDate.replace("-", "") + "-" + endDate.replace("-", "")
        os.makedirs(f"static/images/{folder}", exist_ok=True)

        startDate = pd.to_datetime(startDate)
        endDate = pd.to_datetime(endDate)

        plotFunctions = {
            "totalTimeSpentListening": getTimeSpentListening, 
            "totalSongsPlayed": getNumSongsPlayed,
            "mostListenedToSongsDuration": getMostListenedToSongsByDuration,
            "mostListenedToSongsOccurences": getMostListenedToSongsByOccurences,
            "mostListenedToArtistsDuration": getMostListenedToArtistsByDuration,
            "mostListenedToArtistsOccurences": getMostListenedToArtistsByOccurences,
            "timeOfDay": getTimeOfDaySpentListening
        }

        urlParams = "?"
        for metric in metrics:
            if f"{metric}.png" not in os.listdir(f"static/images/{folder}"):
                plt.figure(figsize=(16,8))
                plot = plotFunctions[metric](startDate, endDate)
                imagePath = f"static/images/{folder}/{metric}.png"
                plot.get_figure().savefig(imagePath, bbox_inches="tight")
                plt.clf()

            urlParams += f"{metric}=1&"

        return redirect(f"/results/{folder}{urlParams[:-1]}")

@app.route('/results/<folder>', methods=['GET'])
def results(folder):
    retVal = ""

    for metric in request.args:
        retVal += f'<img src="{url_for("static", filename=f"images/{folder}/{metric}.png")}" width="50%">'

    return retVal

def getTimeSpentListening(start, end):
    slice = data[(start <= data.Date) & (data.Date < end)]
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
    slice = data[(start <= data.Date) & (data.Date < end)]

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
    slice = data[(start <= data.Date) & (data.Date < end)]

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
    slice = data[(start <= data.Date) & (data.Date < end)]

    mostListenedTo = slice["Name"].value_counts().sort_values()[-25:].reset_index()

    plot = sns.barplot(mostListenedTo, x="count", y="Name", color=color, saturation=1)
    plot.set_title(f'Most Listened To Songs between {start.date()} and {end.date()} (Occurences)')
    plot.set_xlabel('Count')
    plot.set_ylabel('')

    return plot

def getMostListenedToArtistsByDuration(start, end):
    slice = data[(start <= data.Date) & (data.Date < end)]

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
    slice = data[(start <= data.Date) & (data.Date < end)]

    mostListenedTo = slice["Artist"].value_counts().sort_values()[-25:].reset_index()

    plot = sns.barplot(mostListenedTo, x="count", y="Artist", color=color, saturation=1)
    plot.set_title(f'Most Listened To Artists between {start.date()} and {end.date()} (Occurences)')
    plot.set_xlabel('Count')
    plot.set_ylabel('')

    return plot

def getTimeOfDaySpentListening(start, end):
    slice = data[(start <= data.Date) & (data.Date < end)]

    plot = sns.histplot(slice, x=(slice["Hour"] - 9) % 24, bins=range(25), color=color, alpha=1)
    plot.set_title(f'Hour Distribution of Listening between {start.date()} and {end.date()}')
    plot.set_ylabel('Count')
    plot.yaxis.set_major_locator(MaxNLocator(integer=True))
    plt.xticks([hour for hour in range(25)], [f"{(hour + 9) % 24}:00" for hour in range(25)])

    return plot

if __name__ == "__main__":
    app.run(debug=True)