import { useEffect } from "react";
import { useState } from "react";
import queryString from 'query-string';
import { useHistory, useLocation } from "react-router-dom";
import { Clique } from "./CliqueDetail";
import { Button, ButtonGroup, Container, Input, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";

interface CharacterSearchReturn{
    characterId: string;
    characterName: string;
}

export function ManageClique(){
    const [data, setData] = useState<Clique>();

    const location = useLocation();
    const history = useHistory();

    const values = queryString.parse(location.search)
    const cliqueId = values.id;

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchReturn, setSearchReturn] = useState<CharacterSearchReturn[]>();

    const [selectedCharacters, setSelectedCharacters] = useState<CharacterSearchReturn[]>([]);

    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/clique/user-clique-officer?id=" + cliqueId, requestInit)
            .catch(() => history.push("/"));

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

    function addCharacterToSelectedCharacters(character: CharacterSearchReturn) {
        if (!selectedCharacters.includes(character)){
            setSelectedCharacters(prev => {
                return [
                    ...prev,
                    character
                ]
            });
        }
    }

    function handleClick(){
        var body = {
            cliqueId: cliqueId,
            addedCharacterIds: selectedCharacters.map(c => c.characterId)
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

        fetch("https://localhost:44394/api/clique/send-invites", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/clique?id=" + cliqueId));
    }

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/character/search-for-clique?search=" + searchTerm + "&id=" + cliqueId, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSearchReturn(response);
            });
    }, [searchTerm]);

    return(
        <>
        {data == undefined ? <div>loading</div> : 
        <Container>
            <Jumbotron>
                <h1>{data.cliqueName}</h1>
                <hr className="my-2" />

                <Label>Invite</Label>
                <Input
                    name="search"
                    value={searchTerm}
                    placeholder="Search characters..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ButtonGroup className="mb-2">
                    {selectedCharacters?.map((character) => (
                        <Button key={character.characterId} disabled>{character.characterName}</Button>
                    ))}
                </ButtonGroup>

                <ListGroup>
                    {searchReturn?.map((character) => (
                        <ListGroupItem key={character.characterId} onClick={(e) => addCharacterToSelectedCharacters(character)}><Button>{character.characterName}</Button></ListGroupItem>
                    ))}
                </ListGroup>

                <hr className="my-2"/>

                <Button color="secondary" onClick={handleClick}>
                    Submit
                </Button>
            </Jumbotron>
        </Container>
        }
        </>
    )
}