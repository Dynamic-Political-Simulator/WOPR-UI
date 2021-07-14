import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';
import {PlayerCharacterListing, PlayerCharacter, Species} from './PlayerCharacterListing'

export function CreateCharacter() {
    const [name, setName] = useState<string>();
    const [species, setSpecies] = useState<string>();
    const [bio, setBio] = useState<string>();

    const [error, setError] = useState<string | undefined>(undefined);

    const [data, setData] = useState<string[]>();

    const history = useHistory();

    useEffect(() => {
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
            .then((response) => {
                setData(response);
                //@ts-ignore
                setSpecies(response[0]);
            });
        
       
    }, []);

    function handleClick() {
        var body = {
            characterName: name,
            species: species,
            characterBio: bio
        }

        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };

        fetch(process.env.BASE_URL + "character/create-character", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/my-characters"))
    }

    return(
        <Container>
            <Jumbotron>
                <h1>Characters</h1>

                <hr className="my-2" />

                <Label>Name</Label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Label>Species</Label>
                    <Input
                        type="select"
                        name="species"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                    >
                        {data?.map((species) => (
                            <option>{species}</option>
                        ))}
                    </Input>

                <Label>Bio</Label>
                <Input
                    type="textarea"
                    name="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <Button color="secondary" onClick={handleClick}>
                    Create
                </Button>
            </Jumbotron>
        </Container>
    )
}