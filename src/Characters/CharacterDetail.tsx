import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router';
import { Alert, Button, Container, Jumbotron, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { PlayerCharacter } from './PlayerCharacterListing';
import { useCookies } from 'react-cookie';

interface PlayerCharacterDetail {
    characterId: string;
    characterName: string;
    characterBio: string;

    yearOfBirth: number;
    yearOfDeath: number;
    causeOfDeath: string;
    
    species: string;
    userOwnsCharacter: boolean;
}

export function CharacterDetail() {
    const [data, setData] = useState<PlayerCharacterDetail>();
    const [cookies, setCookie] = useCookies();
    const [error, setError] = useState<string | undefined>(undefined);

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const location = useLocation();
    const history = useHistory();

    const values = queryString.parse(location.search)

    const characterId = values.id;

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/character/get-character?id=" + characterId, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
            });
    }, []);

    function handleClickEdit() {
        history.push("edit-character?id=" + data?.characterId);
    }

    function handleClickAdminEdit() {
        history.push("admin-edit-character?id=" + data?.characterId);
    }

    function handleClickDelete() {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/admin-character/delete-character?id=" + characterId, requestInit)
            .then((response) => {
                if (response.ok) {
                    history.push("character-search");
                }
                else{
                    setError("Something went wrong.");
                }
            });
    }

    return (
        <Container>
            <Jumbotron>
                <h1>{data?.characterName}</h1>
                <hr className="my-2"/>

                <p>Species: {data?.species}</p>

                {data?.causeOfDeath == null ? 
                <p>{data?.yearOfBirth} - Present</p> : 
                <>
                    <p>{data?.yearOfBirth} - {data?.yearOfDeath}</p>
                    <p>Cause of death: {data?.causeOfDeath}</p>
                </>}

                <p>Bio: {data?.characterBio}</p>
                
                {data?.userOwnsCharacter == true ? 
                <Button color="secondary" onClick={handleClickEdit}>
                    Edit
                </Button> 
                : null}
                { cookies["isAdmin"] === "true" ?
                <>
                    <Button color="secondary" onClick={handleClickAdminEdit}>
                        Admin Edit
                    </Button>
                    <Button color="danger" onClick={toggle}>
                        Delete
                    </Button> 
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Are you sure you want to delete {data?.characterName}?</ModalHeader>
                        <ModalBody>
                            This action cannot be undone.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={handleClickDelete}>Delete</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </>
                : null}
                {error != undefined ? 
                    <Alert color="danger">
                        {error}
                    </Alert>
                : null}
                
            </Jumbotron>
        </Container>
    )
}
