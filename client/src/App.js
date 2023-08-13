import React, {useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Header from "./components/Header";
import Overall from "./Overall";
import ArtistHistory from "./ArtistHistory";
import SongHistory from "./SongHistory"

export default function App() {
	// const [pages, setPages] = useState({"Log In": "/login", "Register": "/register"});
	const [pages, setPages] = useState({"Overall": "/overall", "Artist History": "/artist-history", "Song History": "/song-history"});
	
	return (
		<Router>
			<Header pages={pages} />

			<Switch>
				<Route exact path="/"></Route>
				<Route exact path="/login"></Route>
				<Route exact path="/register"></Route>
				<Route exact path="/overall"><Overall/></Route>
				<Route exact path="/artist-history"><ArtistHistory/></Route>
				<Route exact path="/song-history"><SongHistory/></Route>
			</Switch>
		</Router>
	);
}
