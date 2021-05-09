import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router';
import { Button, Container, Jumbotron } from 'reactstrap';
import { PlayerCharacter } from './PlayerCharacterListing';
import { useCookies } from 'react-cookie';

interface PlayerCharacterWithOwnership extends PlayerCharacter{
    userOwnsCharacter: boolean;
}

export function CharacterDetail() {
    const [data, setData] = useState<PlayerCharacterWithOwnership>();
    const [cookies, setCookie] = useCookies();

    const location = useLocation();
    const history = useHistory();

    const values = queryString.parse(location.search)

    const characterId = values.id;

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
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

    function handleClick() {
        history.push("edit-character?id=" + data?.characterId);
    }

    return (
        <Container>
            <Jumbotron>
                <h1>{data?.characterName}</h1>
                <hr className="my-2"/>

                <p>Species: {data?.species.speciesName}</p>

                {data?.causeOfDeath == null ? 
                <p>{data?.yearOfBirth} - Present</p> : 
                <>
                    <p>{data?.yearOfBirth} - {data?.yearOfDeath}</p>
                    <p>Cause of death: {data?.causeOfDeath}</p>
                </>}

                <p>Bio: {data?.characterBio}</p>
                
                {data?.userOwnsCharacter == true || cookies.get("isAdmin") == true ? 
                <Button color="secondary" onClick={handleClick}>
                    Edit
                </Button> 
                : null}
                
            </Jumbotron>
        </Container>
    )
}
