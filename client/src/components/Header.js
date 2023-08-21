import React from "react";
import {Link, useLocation, useHistory} from "react-router-dom"

export default function Header(props) {
    const {pages, logOut} = props;
    const location = useLocation();
    const history = useHistory();

    function onLogOut() {
        logOut();
        history.push("/");
    }

    return (
        <header className="p-3 border-bottom">
            <div className="container-fluid">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <img className="bi me-2" width="40" height="40" aria-label="Spotify" src="spotify.png" />
                        <span className="fs-4">Spotify Wrapped+</span>
                    </Link>

                    <ul className="nav nav-pills">
                        {Object.keys(pages).map(page => {
                            const className = pages[page] === location ? "nav-link px-2 link-secondary" : "nav-link px-2 link-body-emphasis";
                            return (
                                <li key={page}>
                                    <Link to={pages[page]} className={className}>{page}</Link>
                                </li>
                            );
                        })}
                    </ul>

                    {
                        localStorage.getItem("username") && 
                        <div className="flex-shrink-0 dropdown ps-2">
                            <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="profile.jpg" alt="profile" width="32" height="32" className="rounded-circle"/>
                            </a>
                            <ul className="dropdown-menu text-small shadow">
                                <li>
                                    <Link to="/upload" className="dropdown-item">Upload Data</Link>
                                </li>
                                <li><hr className="dropdown-divider"/></li>
                                <li>
                                    <button className="dropdown-item" onClick={onLogOut}>Log out</button>
                                </li>
                            </ul>
                        </div>
                    }

                </div>
            </div>
        </header>
    );
}
