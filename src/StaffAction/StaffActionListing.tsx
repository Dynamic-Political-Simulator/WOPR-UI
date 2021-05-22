import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ListGroupItem } from 'reactstrap';

export interface StaffActionSummary {
    staffActionId: string;
    staffActionTitle: string;
    addedPlayers: string[];
    assignedStaff: string[];
}

interface props {
    StaffAction: StaffActionSummary;
}

export function StaffActionListing(props: props){
    const history = useHistory();

    function handleClick() {
        history.push("/staff-action?id=" + props.StaffAction.staffActionId);
    }

    return(
        <ListGroupItem>
            <p>Title: {props.StaffAction.staffActionTitle}</p>
            <p>Added players: {props.StaffAction.addedPlayers}</p>
            <p>Assigned staff: {props.StaffAction.assignedStaff}</p>
            <Button color="secondary" onClick={() => handleClick()}>
                Open
            </Button>
        </ListGroupItem>
    )
}