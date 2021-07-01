import { useEffect } from "react";
import { useState } from "react";
import queryString from 'query-string';
import { Button, Container, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";
import { useHistory, useLocation } from "react-router-dom";

interface Member {
    characterId: string;
    characterName: string;
}

export interface Clique {
    cliqueName: string
    members: Member[]
    officers: Member[]
    alignments: string[]
    money: number
    userIsOfficer: boolean
}

export function CliqueDetail(){
    const [data, setData] = useState<Clique>();

    const location = useLocation();
    const history = useHistory();
    const values = queryString.parse(location.search)

    const cliqueId = values.id;

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/clique/get-clique?id=" + cliqueId, requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));   
    }, []);

    function handleManageClick(){
        history.push("manage-clique?id=" + cliqueId);
    }

    return (
        <>
        {data == undefined? <div>loading</div> : 
        <Container>
            <Jumbotron className="d-flex flex-column">
                <h1>{data?.cliqueName}</h1>
                <hr className="my-2"/>
                <Label>Money: {data.money}</Label>
                <Label>Officers:</Label>
                <ListGroup>
                    {data.officers.map((i) => <ListGroupItem key={i.characterId}>{i.characterName}</ListGroupItem>)}
                </ListGroup>
                <Label>Members:</Label>
                <ListGroup>
                    {data.members.map((i) => <ListGroupItem key={i.characterId}>{i.characterName}</ListGroupItem>)}
                </ListGroup>
                {data.userIsOfficer ? 
                <>
                    <hr className="my-2"/>
                    <Button style={{width:'100px'}} onClick={handleManageClick}>Manage</Button>
                </> 
                : null}
                
            </Jumbotron>
        </Container>
        }
        </>
    )
}