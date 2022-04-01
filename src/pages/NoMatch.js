import React from "react";
import {useHistory} from "react-router-dom";

const NoMatch = () => {
    const history = useHistory();

    return (
        <div className="container-fluid" id={"login"}>
            <div className="row">
                <div className="col-md-7 login-side">
                    <div className={'login-container w-50'}>
                        <h1>Error 404</h1>
                        <p className="lead mb-4">
                            Nie znaleziono strony, której szukasz
                        </p>
                        <button type="submit" className="btn btn-primary mt-3" onClick={()=> history.push('/')}>
                            Wróć
                        </button>
                    </div>
                </div>
                <div className="col-md-5 carousel-side"></div>
            </div>
        </div>
    )
}

export default NoMatch;
