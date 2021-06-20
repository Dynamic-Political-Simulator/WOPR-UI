import { useEffect } from "react";
import { useState } from "react";
import queryString from 'query-string';
import { Button, Container, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";
import { useLocation } from "react-router-dom";

export interface Clique {
    cliqueName: string
    members: string[]
    officers: string[]
    alignments: string[]
    money: number
    userIsOfficer: boolean
}

export function CliqueDetail(){
    const [data, setData] = useState<Clique>();

    const location = useLocation();
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
                    {data.officers.map((i) => <ListGroupItem key={i}>{i}</ListGroupItem>)}
                </ListGroup>
                <Label>Members:</Label>
                <ListGroup>
                    {data.members.map((i) => <ListGroupItem key={i}>{i}</ListGroupItem>)}
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