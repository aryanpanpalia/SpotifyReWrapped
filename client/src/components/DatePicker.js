import React from "react";

export default function DatePicker(props) {
    const {id, label, date, setDate} = props;

    function updateState(event) {
        const {value} = event.target;
        setDate(value);    
    }

    return (
        <div className="form-floating my-3">
            <input className="form-control" type="date" name={id} id={id} min="2021-09-23" max="2023-06-04" value={date} onChange={updateState}/>
            <label>{label}</label>
        </div>
    );
}