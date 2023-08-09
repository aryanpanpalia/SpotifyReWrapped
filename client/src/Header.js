import React from "react";

export default function Header() {
    return (
        <header class="p-3 border-bottom">
            <div class="container-fluid">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <img class="bi me-2" width="40" height="40" aria-label="Spotify" src="spotify.png" />
                        <span class="fs-4">Spotify Wrapped+</span>
                    </a>

                    <ul class="nav nav-pills">
                        <li><a href="/" class="nav-link px-2 link-secondary">Overall</a></li>
                        <li><a href="/" class="nav-link px-2 link-body-emphasis">Song History</a></li>
                        <li><a href="/" class="nav-link px-2 link-body-emphasis">Artist History</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
