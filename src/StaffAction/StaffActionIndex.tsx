import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Jumbotron, ListGroup } from 'reactstrap';
import { StaffActionListing, StaffActionSummary } from './StaffActionListing';

export function StaffActionIndex(){
    const [data, setData] = useState<StaffActionSummary[]>();

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

        fetch("https://localhost:44394/api/staff-action/my-staff-actions", requestInit)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                setData(response);
            });
    }, []);

    function handleClick() {
        history.push("/create-staff-action")
    }

    return(
        <Container>
            <Jumbotron>
                <h1>Staff Actions</h1>

                <Button color="secondary" onClick={() => handleClick()}>
                    Create
                </Button>

                <hr className="my-2" />
                <ListGroup>
                    {data?.map((i) => (
                        <StaffActionListing 
                            StaffAction = {i}
                        />
                    ))}
                </ListGroup>
            </Jumbotron>
        </Container>
    )
}