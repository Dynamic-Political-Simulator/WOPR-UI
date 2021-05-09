import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Jumbotron, ListGroup } from 'reactstrap';
import {PlayerCharacterListing, PlayerCharacter} from './PlayerCharacterListing'


export function CharacterIndex() {
    const [data, setData] = useState<PlayerCharacter[]>();

    const history = useHistory();

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/character/my-characters", requestInit)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                setData(response);
            });
    }, []);

    function handleClick() {
        history.push("/create-character")
    }

    return(
        <Container>
            <Jumbotron>
                <h1>Characters</h1>

                <Button color="secondary" onClick={() => handleClick()}>
                    Create
                </Button>

                <hr className="my-2" />
                <ListGroup>
                    {data?.map((i) => (
                        <PlayerCharacterListing 
                            Character = {i}
                        />
                    ))}
                </ListGroup>
            </Jumbotron>
        </Container>
    )
}
