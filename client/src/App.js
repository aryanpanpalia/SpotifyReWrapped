import React, {useState} from "react";
import DatePicker from "./DatePicker";
import Header from "./Header";
import MetricSelector from "./MetricSelector";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";

function createImageFromURL(url) {
	const imgStyle = {width: "100%", height: "auto"};
	return (
		<div>
			<img src={"http://127.0.0.1:5000/" + url} alt="" style={imgStyle} key={url}/>
		</div>
	);
}

function App() {
	const [startDate, setStartDate] = useState("2021-09-23");
	const [endDate, setEndDate] = useState("2023-06-04");
	const [metrics, setMetrics] = useState([])
	const [imageURLs, setImageURLs] = useState([]);
	const [loading, setLoading] = useState(false);

	function onSubmit(event) {
		setLoading(true);
		setImageURLs([]);

		let url = "http://127.0.0.1:5000?startDate=" + startDate + "&endDate=" + endDate;
		metrics.forEach(metric => url += "&metrics=" + metric)
		
		// Wait 500ms before sending request to have better loading screen experience
		setTimeout(
			() => axios.get(url).then(response => setImageURLs(response.data.imageURLs)), 
			500
		);
		
		event.preventDefault();
	}
	
	function ImageCarousel() {
		return (
			<Carousel renderIndicator={false} dynamicHeight={true}>
				{imageURLs.map(createImageFromURL)}
			</Carousel>
		);
	}

	function LoadingGIF() {
		return <img src="loading.gif" className="mx-auto d-block" alt="Loading..."/>
	}

	return (
		<div>
			<Header />
			<div className="container-fluid">
				<div className="row justify-content-center">
					<div className="col-md-auto border p-3">
						<form onSubmit={onSubmit}>
							<DatePicker id="startDate" label="Start Date" date={startDate} setDate={setStartDate}/>
							<DatePicker id="endDate" label="End Date" date={endDate} setDate={setEndDate} />
							<MetricSelector metrics={metrics} setMetrics={setMetrics} />
							<button className="btn btn-primary" type="submit">Submit</button>
						</form>
					</div>

					<div className="col border">
						{imageURLs.length > 0 ? ImageCarousel() : loading && LoadingGIF()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
