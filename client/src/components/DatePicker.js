import React from "react";

export default function DatePicker(props) {
    const {id, label, setDate} = props;

    function updateState(event) {
        const {value} = event.target;
        setDate(value);    
    }

    return (
        <div className="form-floating my-3">
            <input className="form-control" type="date" name={id} id={id} onChange={updateState}/>
            <label>{label}</label>
        </div>
    );
}
