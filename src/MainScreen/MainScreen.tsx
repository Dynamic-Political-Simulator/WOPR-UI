import React, { useEffect } from 'react';
import { Terminal } from '../Terminal/Terminal';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useHistory,
} from "react-router-dom";
import { PopsimMenu } from '../Popsim/PopsimMenu';
import Switch from 'react-bootstrap/esm/Switch';
import { CharacterIndex } from '../Characters/CharacterIndex';
import { CreateCharacter } from '../Characters/CreateCharacter';
import { CharacterDetail } from '../Characters/CharacterDetail';
import { EditCharacter } from '../Characters/EditCharacter';
import { CharacterSearch } from '../Characters/CharacterSearch';
import { AdminEditCharacter } from '../Characters/AdminEditCharacter';
import { StaffActionIndex } from '../StaffAction/StaffActionIndex';
import { CreateStaffAction } from '../StaffAction/CreateStaffAction';
import { StaffActionDetail } from '../StaffAction/StaffActionDetail';
import { useCookies } from 'react-cookie';
import { StaffActionAddPlayer } from '../StaffAction/StaffActionAddPlayer';
import { checkAuth } from '../Auth/AuthService'
import SaveUploader from '../SaveUploader/SaveUploader';
import { PopsimAlignments } from '../Popsim/Alignments/PopsimAlignments';
import { EditorSettings } from 'typescript';
import { EditAlignment } from '../Popsim/Alignments/EditAlignment';
import { CliqueIndex } from '../Popsim/Cliques/CliqueIndex';
import { CreateClique } from '../Popsim/Cliques/CreateClique';
import { CliqueDetail } from '../Popsim/Cliques/CliqueDetail';
import { ManageClique } from '../Popsim/Cliques/ManageClique';

export function MainScreen() {
    const [cookies, setCookie] = useCookies();

    useEffect(() => {
        var isAdmin = cookies["isAdmin"]

        if (isAdmin === undefined) {
            var requestInit: RequestInit = {
                mode: "cors",
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            };

            fetch("https://localhost:44394/api/user/is-admin", requestInit)
                .then((response) => response.json())
                .then((response) => {
                    setCookie("isAdmin", response);
                })
                .catch(() => {
                    window.location.href = "https://localhost:44394/api/auth/auth";
                });
        }
    });
    return (
        <Router>
            <Route exact path="/">
                <Terminal />
            </Route>
            <Route path="/popsim">
                <PopsimMenu />
            </Route>
            <Route path="/my-characters">
                <CharacterIndex />
            </Route>
            <Route path="/create-character">
                <CreateCharacter />
            </Route>
            <Route path="/character">
                <CharacterDetail />
            </Route>
            <Route path="/edit-character">
                <EditCharacter />
            </Route>
            <Route path="/admin-edit-character">
                <AdminEditCharacter />
            </Route>
            <Route path="/character-search">
                <CharacterSearch />
            </Route>
            <Route path="/my-staff-actions">
                <StaffActionIndex />
            </Route>
            <Route path="/create-staff-action">
                <CreateStaffAction />
            </Route>
            <Route path="/staff-action">
                <StaffActionDetail />
            </Route>
            <Route path="/staff-action-add">
                <StaffActionAddPlayer />
            </Route>
            <Route path="/upload-save">
                <SaveUploader />
            </Route>
            <Route path="/alignments">
                <PopsimAlignments/>
            </Route>
            <Route path="/edit-alignment">
                <EditAlignment/>
            </Route>
            <Route path="/my-cliques">
                <CliqueIndex/>
            </Route>
            <Route path="/create-clique">
                <CreateClique/>
            </Route>
            <Route path="/clique">
                <CliqueDetail/>
            </Route>
            <Route path="/manage-clique">
                <ManageClique/>
            </Route>
        </Router>
    )
}