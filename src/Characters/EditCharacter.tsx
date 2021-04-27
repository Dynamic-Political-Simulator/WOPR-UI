import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { useLocation } from 'react-router';
import { Button, Container, Input, Jumbotron, Label } from 'reactstrap';
import { PlayerCharacter } from './PlayerCharacterListing';
import { useHistory } from 'react-router-dom';


export function EditCharacter() {
    const [data, setData] = useState<PlayerCharacter>();
    const [bio, setBio] = useState<string>();
    const [error, setError] = useState<string | undefined>(undefined);

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
                setBio(response.characterBio);
            });

    }, []);

    function handleClick() {
        var body = {
            characterId: data?.characterId,
            characterBio: bio
        }

        var requestInit: RequestInit = {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };

        fetch("https://localhost:44394/api/character/edit-character", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/character?id=" + data?.characterId))
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Edit: {data?.characterName}</h1>
                <hr className="my-2"/>

                <p>Species: {data?.species.speciesName}</p>

                {data?.causeOfDeath == null ? 
                <p>{data?.yearOfBirth} - Present</p> : 
                <>
                    <p>{data?.yearOfBirth} - {data?.yearOfDeath}</p>
                    <p>Cause of death: {data?.causeOfDeath}</p>
                </>}

                <Label>Bio</Label>
                <Input
                    type="textarea"
                    name="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <Button color="secondary" onClick={handleClick}>
                    Save
                </Button>
            </Jumbotron>
        </Container>
    )
}