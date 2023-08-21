import React, {useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Header from "./components/Header";
import Overall from "./Overall";
import ArtistHistory from "./ArtistHistory";
import SongHistory from "./SongHistory"
import LoginRegister from "./LoginRegister";
import Upload from "./Upload";

export default function App() {
	const [pages, setPages] = useState({"Log In": "/login", "Register": "/register"});
	
	function swapHeaderPages() {
		setPages({"Overall": "/overall", "Artist History": "/artist-history", "Song History": "/song-history"});
	}

	function logOut() {
		localStorage.clear();
		setPages({"Log In": "/login", "Register": "/register"});
	}

	if ("Log In" in pages && localStorage.getItem("username")) {
		swapHeaderPages();
	}

	return (
		<Router>
			<Header pages={pages} logOut={logOut}/>

			<Switch>
				<Route exact path="/"></Route>
				<Route exact path="/login"><LoginRegister type="login" onComplete={swapHeaderPages}/></Route>
				<Route exact path="/register"><LoginRegister type="register" onComplete={swapHeaderPages}/></Route>
				<Route exact path="/upload"><Upload/></Route>
				<Route exact path="/overall"><Overall/></Route>
				<Route exact path="/artist-history"><ArtistHistory/></Route>
				<Route exact path="/song-history"><SongHistory/></Route>
			</Switch>
		</Router>
	);
}
