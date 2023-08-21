import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";

export default function Upload() {
    const [files, setFiles] = useState();
    const [redirect, setRedirect] = useState(false);

    function uploadFilesToServer(event) {
        if (!files) {
            return;
        }

        const formData = new FormData();
        formData.append("username", localStorage.getItem("username"));
        for (let i = 0; i < files.length; i++) {
            formData.append(i, files[i]);
        }

        axios.post("http://127.0.0.1:5000/upload", formData).then(() => setRedirect(true));

        event.preventDefault();
    }

    function selectFiles(event) {
        const fs = event.target.files;
        setFiles(fs);
    }

    if (redirect) {
        return <Redirect to="/overall" />
    }
   
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6">
                    <h3 className="form-label my-3">Upload your Spotify History Files</h3>
                    <p style={{textAlign: "justify"}}>
                        You can submit a request to download your Extended Spotify History <a href="https://www.spotify.com/us/account/privacy/">here</a>.
                        Download can take up to a month to be processed by Spotify. 
                        You must wait for the Extended Spotify History as only that contains the complete history spanning the lifetime of your account. 
                        Once downloaded, unzip the file and upload all the JSON files held within. 
                    </p>

                    <form onSubmit={uploadFilesToServer}>
                        <input className="form-control mb-3" type="file" id="formFileMultiple" multiple onChange={selectFiles} accept=".json"/>
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </form>

                </div>
            </div>
        </div>
    );
}
