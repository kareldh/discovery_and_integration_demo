import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Menu} from "semantic-ui-react";
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
                    {/*<ul>*/}
                        {/*<li>*/}
                            {/*<Link to="/OpenLRDemo/">OpenLR demo page</Link>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                            {/*<Link to="/DiscoveryDemo/">Dataset discovery demo page</Link>*/}
                        {/*</li>*/}
                        {/*/!*<li>*!/*/}
                            {/*/!*<Link to="/OpenStreetMapLinesView/">Display lines of OpenStreetMap</Link>*!/*/}
                        {/*/!*</li>*!/*/}
                    {/*</ul>*/}

                    {/*<hr />*/}

                    <Route path="/OpenLRDemo/" component={OpenLrDemo} />
                    <Route path="/DiscoveryDemo/" component={MainDemo} />
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