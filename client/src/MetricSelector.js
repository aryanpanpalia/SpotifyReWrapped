import React from "react";

export default function MetricSelector(props) {
    const metrics = props.metrics;
    const setMetrics = props.setMetrics;
    const selectStyle = {height: "236px", overflow: "hidden"};

    function updateState(event) {
        const newMetrics = Array.from(event.target.selectedOptions, (option) => option.value);
        setMetrics(newMetrics);
    }

    return (
        <div className="form-floating my-3">
            <select className="form-select" name="metrics" id="metrics" multiple style={selectStyle} onChange={updateState} value={metrics}>
                <option value="totalTimeSpentListening">Total Time Spent Listening</option>
                <option value="totalSongsPlayed">Total Songs Played</option>
                <option value="mostListenedToSongsDuration">Most Listened to Songs (by duration)</option>
                <option value="mostListenedToSongsOccurences">Most Listened to Songs (by occurences)</option>
                <option value="mostListenedToArtistsDuration">Most Listened to Artists (by duration)</option>
                <option value="mostListenedToArtistsOccurences">Most Listened to Artists (by occurences)</option>
                <option value="timeOfDay">Time of Day Spent Listening</option>
            </select>
            <label>Metrics to Analyze</label>
        </div>
    );
}
