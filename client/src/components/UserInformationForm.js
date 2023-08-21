import React from "react";

export default function UserInformationForm(props) {
    const {header, buttonText, username, setUsername, password, setPassword, onSubmit} = props;

    const usernameStyle = {borderBottomLeftRadius: 0, borderBottomRightRadius: 0};
    const passwordStyle = {borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0};

    function updateUsername(event) {
        const {value} = event.target;
        setUsername(value);
    }

    function updatePassword(event) {
        const {value} = event.target;
        setPassword(value);
    }

    return (
        <div className="d-flex align-items-center py-4">
            <div className="mx-auto w-100" style={{maxWidth: "350px"}}>
                <form onSubmit={onSubmit}>
                    <h3 className="mb-3">{header}</h3>    

                    <div className="form-floating">
                        <input type="text" className="form-control" id="floatingInput" style={usernameStyle} value={username} onChange={updateUsername}/>
                        <label>Username</label>
                    </div>
                    
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" style={passwordStyle} value={password} onChange={updatePassword}/>
                        <label>Password</label>
                    </div>

                    <button className="btn btn-primary w-100 py-2 mt-3" type="submit">{buttonText}</button>
                </form>
            </div>
        </div>
    );
}
