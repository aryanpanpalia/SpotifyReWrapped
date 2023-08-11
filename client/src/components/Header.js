import React from "react";

export default function Header(props) {
    const {pages, page, setPage} = props;

    return (
        <header className="p-3 border-bottom">
            <div className="container-fluid">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <img className="bi me-2" width="40" height="40" aria-label="Spotify" src="spotify.png" />
                        <span className="fs-4">Spotify Wrapped+</span>
                    </a>

                    <ul className="nav nav-pills">
                        {pages.map(p => {
                            const className = p === page ? "nav-link px-2 link-secondary" : "nav-link px-2 link-body-emphasis";
                            return (
                                <li key={p}>
                                    <button onClick={() => setPage(p)} className={className}>{p}</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </header>
    );
}
