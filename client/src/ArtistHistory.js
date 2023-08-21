import React, {useState, useEffect} from "react";
import axios from "axios";
import StringSelector from "./components/StringSelector";

export default function ArtistHistory() {
    const [artists, setArtists] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [imageURL, setImageURL] = useState("");
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const localStorageArtists = JSON.parse(localStorage.getItem("artists"));

        if (localStorageArtists) {
            setArtists(localStorageArtists);
        } else {
            axios.get("http://127.0.0.1:5000/artists/" + username).then(response => {
                setArtists(response.data.artists);
                localStorage.setItem("artists", JSON.stringify(response.data.artists));
            });
        }
    }, []);

    function onClick() {
        setLoading(true);
        setImageURL("");

        let url = "http://127.0.0.1:5000/artistHistory/" + username + "?";
        selectedArtists.forEach(artist => url += "&artists=" + artist);

        setTimeout(
            () => axios.get(url).then(response => setImageURL(response.data.imageURL)), 
            500
        );
    }

	function LoadingGIF() {
        return <img src="loading.gif" className="mx-auto d-block" alt="Loading..."/>;
	}

    if (artists.length === 0) return <div />

	return (			
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-auto border p-3" style={{minWidth: "350px"}}>
                    <StringSelector values={artists} selectedValues={selectedArtists} setSelectedValues={setSelectedArtists} type="Artists" />
                    <button className="btn btn-primary mx-1" onClick={onClick}>Submit</button>
                </div>

                <div className="col border">
                    {
                        (imageURL.length > 0 && <img src={"http://127.0.0.1:5000/" + imageURL} alt="" style={{width: "100%", height: "auto"}} />) ||
                        (loading && LoadingGIF())
                    }
                </div>
            </div>
        </div>
	);
}
