import React, {Component} from 'react';
import {HashRouter as Router, Route} from "react-router-dom";
import './App.css';
// import ApiContainer from "./components/ApiContainer";
import OpenLrDemo from "./components/OpenLrDemo";
import {MainDemo} from "./components/MainDemo";
import NavBar from "./components/NavBar";

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <NavBar/>
                    <Route path={"/OpenLRDemo/"} component={OpenLrDemo}  />
                    <Route path={"/DiscoveryDemo/"} component={MainDemo} />
                    {/*<Route path="/OpenStreetMapLinesView/" component={ApiContainer} />*/}
                </div>
            </Router>
        );
    }
}

export default App;


// <ApiContainer/>
// <OpenLrDemo/>
// <MainDemo/>