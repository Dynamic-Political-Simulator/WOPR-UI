import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Label, ListGroup, ListGroupItem } from "reactstrap";

interface CliqueOverview {
    cliques: Clique[]
    cliqueInvites: CliqueInvite[]
}

interface Clique {
    id: string
    name: string
}

interface CliqueInvite {
    id: string
    name: string
}

export function CliqueIndex() {
    const [data, setData] = useState<CliqueOverview>();

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

        fetch("https://localhost:44394/api/clique/get-overview", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response))
            .catch(() => history.push("/"));
    }, []);

    function handleCliqueClick(id: string){
        history.push("/clique?id=" + id);
    }

    function handleInviteClick(id: string){
        history.push("/clique-invites?id=" + id);
    }

    function handleCreateClick(){
        history.push("/create-clique");
    }

    return(
        <Container>
            <Label>Your cliques</Label>
            <ListGroup>
                {data?.cliques.map((i) => <ListGroupItem key={i.id} onClick={() => handleCliqueClick(i.id)}>
                    {i.name}
                </ListGroupItem>)}
            </ListGroup>
            <hr className="my-2"/>
            <Label>Your invites</Label>
            <ListGroup>
                {data?.cliqueInvites.map((i) => <ListGroupItem key={i.id} onClick={() => handleInviteClick(i.id)}>
                    {i.name}
                </ListGroupItem>)}
            </ListGroup>
            <Button onClick={handleCreateClick}>
                Create Clique
            </Button>
        </Container>
    )
}