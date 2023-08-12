import React, {useState} from "react";
import Header from "./components/Header";
import Overall from "./Overall";
import ArtistHistory from "./ArtistHistory";
import SongHistory from "./SongHistory"

export default function App() {
	const pages = ["Overall", "Artist History", "Song History"]
	const [page, setPage] = useState("Overall");
	
	return (
		<div>
			<Header pages={pages} page={page} setPage={setPage} />
			{
				(page === "Overall" && <Overall />) || 
				(page === "Artist History" && <ArtistHistory />) || 
				(page === "Song History" && <SongHistory />)
			}
		</div>
	);
}
