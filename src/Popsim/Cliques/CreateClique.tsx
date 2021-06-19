import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Container, Input, Jumbotron, Label } from "reactstrap";

export function CreateClique() {
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string | undefined>(undefined);

    const history = useHistory();

    function handleClick() {
        var body = {
            cliqueName: name
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

        fetch("https://localhost:44394/api/clique/create-clique", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/my-cliques"))
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Create Clique</h1>
                <hr className="my-2" />

                <Label>Name</Label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {error == undefined? null : <Alert color="Danger">Something went wrong. Please try again.</Alert>}

                <Button color="secondary" onClick={handleClick}>
                    Create
                </Button>
            </Jumbotron>
        </Container>
    )
}