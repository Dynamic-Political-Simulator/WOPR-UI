import React from 'react';
import { Terminal } from '../Terminal/Terminal';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useHistory,
  } from "react-router-dom";
import PopsimMenu from '../Popsim/PopsimMenu';
import Switch from 'react-bootstrap/esm/Switch';

export function MainScreen() {
    return (
        <Router>
                <Route exact path="/">
                    <Terminal/>
                </Route>
                <Route path="/popsim">
                    <PopsimMenu/>
                </Route>
        </Router>
    )
}