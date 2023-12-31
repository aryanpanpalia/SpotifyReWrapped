import React, {useState} from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import DatePicker from "./components/DatePicker";
import MetricSelector from "./components/MetricSelector";

export default function Overall() {
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [metrics, setMetrics] = useState([])
	const [imageURLs, setImageURLs] = useState([]);
	const [loading, setLoading] = useState(false);

	const username = localStorage.getItem("username");

	function onSubmit(event) {
		if (startDate && endDate) {
			setLoading(true);
			setImageURLs([]);
	
			let url = "http://127.0.0.1:5000/overall/" + username + "?startDate=" + startDate + "&endDate=" + endDate;
			metrics.forEach(metric => url += "&metrics=" + metric)
			
			// Wait 500ms before sending request to have better loading screen experience
			setTimeout(
				() => axios.get(url).then(response => setImageURLs(response.data.imageURLs)), 
				500
			);
		}
		
		event.preventDefault();
	}
	
	function ImageCarousel() {
		return (
			<Carousel renderIndicator={false} dynamicHeight={true} width={"95%"}>
				{imageURLs.map(url => 
                    <div key={url}>
                        <img src={"http://127.0.0.1:5000/" + url} alt="" style={{width: "100%", height: "auto"}}/>
                    </div>
                )}
			</Carousel>
		);
	}

	function LoadingGIF() {
		return <img src="loading.gif" className="mx-auto d-block" alt="Loading..."/>
	}

	return (			
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-auto border p-3">
                    <form onSubmit={onSubmit}>
                        <DatePicker id="startDate" label="Start Date" setDate={setStartDate}/>
                        <DatePicker id="endDate" label="End Date" setDate={setEndDate} />
                        <MetricSelector metrics={metrics} setMetrics={setMetrics} />
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </form>
                </div>

                <div className="col border">
                    {imageURLs.length > 0 ? ImageCarousel() : loading && LoadingGIF()}
                </div>
            </div>
        </div>
	);
}
