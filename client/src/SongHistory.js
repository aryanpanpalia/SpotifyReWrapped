import React, {useState, useEffect} from "react";
import axios from "axios";
import StringSelector from "./components/StringSelector";

export default function SongHistory() {
    const [songs, setSongs] = useState([]);
    const [name2uri, setName2uri] = useState()
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [imageURL, setImageURL] = useState("");
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const localStorageData = JSON.parse(localStorage.getItem("songs"));
        
        if(localStorageData) {
            setSongs(localStorageData.songs);
            setName2uri(localStorageData.name2uri);
        } else {
            axios.get("http://127.0.0.1:5000/songs/" + username).then(response => {
                setName2uri(response.data.name2uri);
                setSongs(response.data.songs);
                localStorage.setItem("songs", JSON.stringify({"songs": response.data.songs, "name2uri": response.data.name2uri}));
            });
        }
    }, []);

    function onClick() {
        setLoading(true);
        setImageURL("");

        let url = "http://127.0.0.1:5000/songHistory/" + username + "?";
        selectedSongs.forEach(song => url += "&uris=" + name2uri[song]);

        setTimeout(
            () => axios.get(url).then(response => setImageURL(response.data.imageURL)), 
            500
        );
    }

	function LoadingGIF() {
        return <img src="loading.gif" className="mx-auto d-block" alt="Loading..."/>;
	}

    if (songs.length === 0) return <div />

    return (			
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-auto border p-3" style={{minWidth: "350px", maxWidth: "500px"}}>
                    <StringSelector values={songs} selectedValues={selectedSongs} setSelectedValues={setSelectedSongs} type="Songs" />
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
