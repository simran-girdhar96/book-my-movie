import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BookShow from "../bookshow/BookShow";
import Confirmation from "../confirmation/Confirmation";
const Controller = () => {
    const baseUrl = "/api/v1/";
    return (
        <Router>
            <div className="main-container">
                <Route
                    path="/bookshow/:id"
                    render={(props) => <BookShow {...props} baseUrl={baseUrl}
                    />}
                />
                <Route
                    path="/confirm/:id"
                    render={(props) => <Confirmation {...props} baseUrl=
                        {baseUrl} />}
                />
            </div>
        </Router>
    );
};
export default Controller;