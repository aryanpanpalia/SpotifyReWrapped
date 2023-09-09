import React from "react";

export default function HomePage() {
    return (
        <div class="container">
            <div class="row gx-5 justify-content-center pt-4">
                <div class="col-lg-6">
                    <div class="text-center">
                        <h1 class="display-5 fw-bolder mb-2">Analyze you Spotify Listening History</h1>
                        <p class="lead my-4">
                            Spotify ReWrapped is a tool that allows you to analyze your Spotify listening habits in more depth than the yearly Spotify Wrapped.
                        </p>
                    </div>
                </div>
            </div>

            <div class="row gx-5 justify-content-center pt-4">
                <div class="col-lg-4 mb-5 mb-lg-0">
                    <h2 class="h4 fw-bolder">View Overall Statistics</h2>
                    <p>Choose metrics to analyze between any two dates. Metrics include most listened to songs and artists as well as listening habits such as how much one used spotify during that time period and what time of day they did so.</p>
                </div>
                <div class="col-lg-4 mb-5 mb-lg-0">
                    <h2 class="h4 fw-bolder">View Artist History</h2>
                    <p>Select any number of artists you have listened to and see how the amount of time you spent listening to them has changed as time has gone on. </p>
                </div>
                <div class="col-lg-4">
                    <h2 class="h4 fw-bolder">View Song History</h2>
                    <p>Select any number of songs you have listened to and see how the amount of time you spent listening to them has changed as time has gone on.</p>
                </div>
            </div>
        </div>
    );
}