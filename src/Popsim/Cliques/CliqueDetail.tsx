import { useEffect } from "react";
import { useState } from "react";
import queryString from 'query-string';
import { Container, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";

interface Clique {
    cliqueName: string
    members: string[]
    officers: string[]
    alignments: string[]
    money: number
}

export function CliqueDetail(){
    const [data, setData] = useState<Clique>();

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
    }, [])

    return (
        <>
        {data == undefined? <div>loading</div> : 
        <Container>
            <Jumbotron>
                <h1>{data?.cliqueName}</h1>
                <hr className="my-2"/>
                <Label>Money: {data.money}</Label>
                <Label>Officers:</Label>
                <ListGroup>
                    {data.officers.map((i) => <ListGroupItem key={i}>{i}</ListGroupItem>)}
                </ListGroup>
                <Label>members:</Label>
                <ListGroup>
                    {data.members.map((i) => <ListGroupItem key={i}>{i}</ListGroupItem>)}
                </ListGroup>
            </Jumbotron>
        </Container>
        }
        </>
    )
}