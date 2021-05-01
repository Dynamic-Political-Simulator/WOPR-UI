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
import { CharacterIndex } from '../Characters/CharacterIndex';
import { CreateCharacter } from '../Characters/CreateCharacter';
import { CharacterDetail } from '../Characters/CharacterDetail';
import { EditCharacter } from '../Characters/EditCharacter';
import { CharacterSearch } from '../Characters/CharacterSearch';

export function MainScreen() {
    return (
        <Router>
                <Route exact path="/">
                    <Terminal/>
                </Route>
                <Route path="/popsim">
                    <PopsimMenu/>
                </Route>
                <Route path="/my-characters">
                    <CharacterIndex/>
                </Route>
                <Route path="/create-character">
                    <CreateCharacter/>
                </Route>
                <Route path="/character">
                    <CharacterDetail/>
                </Route>
                <Route path="/edit-character">
                    <EditCharacter/>
                </Route>
                <Route path="/character-search">
                    <CharacterSearch/>
                </Route>
        </Router>
    )
}