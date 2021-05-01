import React from "react";
import { useHistory } from "react-router-dom";
import { Button, ListGroupItem } from "reactstrap";

export interface Species {
    speciesId: string;
    speciesName: string;
}

export interface PlayerCharacter {
    characterId: string;
    characterName: string;
    yearOfBirth: number;
    yearOfDeath: number;
    causeOfDeath: string;
    characterBio: string;
    species: Species;
}

interface props {
    Character: PlayerCharacter;
}

export function PlayerCharacterListing(props: props){

    const history = useHistory();

    function handleClick() {
        history.push("/character?id=" + props.Character.characterId);
    }

    return(
        <ListGroupItem>
            <p>Name: {props.Character.characterName}</p>
            <p>Species: {props.Character.species.speciesName}</p>
            <Button color="secondary" onClick={() => handleClick()}>
                Details
            </Button>
        </ListGroupItem>
    )
}