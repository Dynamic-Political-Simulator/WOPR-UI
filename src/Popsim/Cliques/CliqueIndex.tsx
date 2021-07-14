import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";

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

        fetch(process.env.BASE_URL + "clique/get-overview", requestInit)
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
            <Jumbotron>
                <Label>Your cliques</Label>
                {data?.cliques.length == 0 ? 
                <ListGroup>
                    <ListGroupItem>Not a member of any Cliques.</ListGroupItem>
                </ListGroup>
                : 
                <ListGroup>
                    {data?.cliques.map((i) => <ListGroupItem key={i.id} onClick={() => handleCliqueClick(i.id)}>
                        {i.name}
                    </ListGroupItem>)}
                </ListGroup>
                }
                
                <hr className="my-2"/>
                <Label>Your invites</Label>
                {data?.cliqueInvites.length == 0 ? 
                <ListGroup>
                    <ListGroupItem>No Clique invites.</ListGroupItem>
                </ListGroup>
                : 
                <ListGroup>
                    {data?.cliqueInvites.map((i) => <ListGroupItem key={i.id} onClick={() => handleInviteClick(i.id)}>
                        {i.name}
                    </ListGroupItem>)}
                </ListGroup>
                }
                <hr className="my-2"/>
                <Button onClick={handleCreateClick}>
                    Create Clique
                </Button>
            </Jumbotron>
        </Container>
    )
}