import React from "react";

export default function StringSelector(props) {
    const {values, selectedValues, setSelectedValues, type} = props;

    function select(event) {
        const {value} = event.target;
        setSelectedValues(prev => [...prev, value]);
    }

    function deselect(value) {
        setSelectedValues(prev => prev.filter(a => a !== value));
    }

    return (
        <div>
            <ul className="list-group">
                {selectedValues.map(value => 
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={value}>
                        <label className="form-check-label">{value}</label>
                        <svg width="20" height="20" focusable="true" viewBox="0 0 24 24" onClick={() => deselect(value)}>
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.58 12 5 17.58 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    </li>         
                )}
            </ul>
            
            <div className="form-floating my-3">
                <select className="form-select" onChange={select} key={selectedValues}>
                    <option></option>
                    {values.filter(value => !selectedValues.includes(value)).map(value => {
                        const valueString = value.substring(0, 45) + (value.length > 45 ? "..." : "");
                        return <option key={value} value={value}>{valueString}</option>;
                    })}
                </select>
                <label>{type}</label>
            </div>
        </div>
    );
}
