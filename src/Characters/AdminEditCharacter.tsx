import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { useLocation } from 'react-router';
import { Button, Container, Input, Jumbotron, Label } from 'reactstrap';
import { useHistory } from 'react-router-dom';

interface PlayerCharacter {
    characterId: string;
    characterName: string;
    yearOfBirth: number;
    yearOfDeath: number;
    causeOfDeath: string;
    characterBio: string;
    species: string;
}

export function AdminEditCharacter(){
    const [data, setData] = useState<PlayerCharacter>();
    const [speciesData, setSpeciesData] = useState<string[]>();

    const [error, setError] = useState<string | undefined>(undefined);

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

        fetch(process.env.BASE_URL + "admin-character/get-character?id=" + characterId, requestInit)
            .then((response) => response.json())
            .then((response) => setData(response))
            .catch(() => setError("Access Denied."));

        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };
    
        fetch(process.env.BASE_URL + "character/get-species", requestInit)
            .then((response) => response.json())
            .then((response) => setSpeciesData(response));

    }, []);

    function handleClick() {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        fetch(process.env.BASE_URL + "admin-character/edit-character", requestInit)
            .then((response) => {
                if (response.ok){
                    history.push("/character?id=" + data?.characterId);
                }
                else{
                    setError("Access Denied.");
                }
            });
    }

    return (
        <>
        {error == undefined ? 
            <Container>
                <Jumbotron>
                    <h1>Admin Edit: {data?.characterName}</h1>
                    <hr className="my-2"/>

                    <Label>Name</Label>
                    <Input
                        name="characterName"
                        value={data?.characterName}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.characterName = e.target.value;
                            setData(newData);
                        }}
                    />

                    <Label>Bio</Label>
                    <Input
                        type="textarea"
                        name="bio"
                        value={data?.characterBio}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.characterBio = e.target.value;
                            setData(newData);
                        }}
                    />

                    <Label>Species</Label>
                    <Input
                        type="select"
                        name="species"
                        value={data?.species}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.species = e.target.value;
                            setData(newData);
                        }}
                    >
                        {speciesData?.map((species) => (
                            <option key={species}>{species}</option>
                        ))}
                    </Input>

                    <Label>Year of birth</Label>
                    <Input
                        type="number"
                        name="yearOfBirth"
                        value={data?.yearOfBirth}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.yearOfBirth = e.target.valueAsNumber;
                            setData(newData);
                        }}
                    />

                    <Label>Year of death (set to 0 if still alive)</Label>
                    <Input
                        type="number"
                        name="yearOfDeath"
                        value={data?.yearOfDeath}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.yearOfDeath = e.target.valueAsNumber;
                            setData(newData);
                        }}
                    />

                    <Label>Cause of death (leave empty if alive)</Label>
                    <Input
                        type="textarea"
                        name="causeOfDeath"
                        value={data?.causeOfDeath}
                        onChange={(e) => {
                            let newData = Object.assign({}, data);
                            newData.causeOfDeath = e.target.value;
                            setData(newData);
                        }}
                    />

                    <Button color="secondary" onClick={handleClick}>
                        Save
                    </Button>
                </Jumbotron>
            </Container> : 
            <p>{error}</p>}
        </>
    )
}