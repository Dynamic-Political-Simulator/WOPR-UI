import React from "react";
import { useEffect, useState } from "react"
import { Button, Container, Input, InputGroup, InputGroupAddon, Jumbotron, Label, ListGroup, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { PlayerCharacter, PlayerCharacterListing } from "./PlayerCharacterListing"

export interface CharacterSearchForm {
    page: number;
    alive: boolean;
    search: string;
}

export function CharacterSearch(){
    const [data, setData] = useState<PlayerCharacter[]>();

    const [totalPages, setTotalPages] = useState<number>(1);
    
    const [page, setPage] = useState<number>(1);
    const [alive, setAlive] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        var body: CharacterSearchForm = {
            page: page,
            alive: alive,
            search: search
        } 

        var requestInit: RequestInit = {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        };

        fetch(process.env.BASE_URL + "character/search", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));

        
    }, [page]);

    function handleClick(){
        var body: CharacterSearchForm = {
            page: page,
            alive: alive,
            search: search
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

        fetch(process.env.BASE_URL + "character/search", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Search</h1>
                <hr className="my-2"/>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button onClick={() => handleClick()}>Search</Button>
                    </InputGroupAddon>
                    <Input
                        type="search"
                        name="search"
                        value={search}
                        placeholder="Search..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                
                <Label check>
                    <Input
                        type="checkbox"
                        name="alive"
                        onChange={(e) => setAlive(e.target.checked)}
                    />
                    Alive characters only
                </Label>
                <hr className="my-2"/>

                <ListGroup>
                    {data?.map((i) => (
                        <PlayerCharacterListing key={i.characterId}
                            Character = {i}
                        />
                    ))}
                </ListGroup>

                <Pagination>
                    {page > 1 ? 
                    <>
                        <PaginationItem>
                            <PaginationLink previous onClick={() => setPage(page-1)}/>
                        </PaginationItem>
                    </>
                    : undefined}

                    {page < totalPages ? 
                    <>
                        <PaginationItem>
                            <PaginationLink next onClick={() => setPage(page+1)}/>
                        </PaginationItem>
                    </>
                    : undefined}                    
                </Pagination>
            </Jumbotron>
        </Container>
    )
}