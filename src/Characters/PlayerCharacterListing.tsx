import React from "react";
import { ListGroupItem } from "reactstrap";

export interface Species{
    SpeciesId: string;
    SpeciesName: string;
}

export interface PlayerCharacter {
    CharacterId: string;
    CharacterName: string;
    YearOfBirth: number;
    YearOfDeath: number;
    CauseOfDeath: string;
    CharacterBio: string;
    Species: Species;
}

interface props {
    Character: PlayerCharacter;
}

export function PlayerCharacterListing(props: props){

    return(
        <ListGroupItem>
            <p>Name: {props.Character.CharacterName}</p>
            <p>Species: {props.Character.Species.SpeciesName}</p>
        </ListGroupItem>
    )
}