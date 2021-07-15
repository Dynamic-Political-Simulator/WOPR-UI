import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';

export function MakeDesc() {
    const [name, setName] = useState<string>();
    const [desc, setDesc] = useState<string>();

    const [error, setError] = useState<string | undefined>(undefined);

    function handleClick() {
        var body = {
            planetName: name,
            planetDescription: desc
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

        fetch(process.env.REACT_APP_BASE_URL + "map/edit-planet-description", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => alert("done"))
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Palnet Description Setter</h1>

                <hr className="my-2" />

                <Label>Name</Label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Label>Description</Label>
                <Input
                    type="textarea"
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />

                <Button color="secondary" onClick={handleClick}>
                    Create
                </Button>
            </Jumbotron>
        </Container>
    )
}