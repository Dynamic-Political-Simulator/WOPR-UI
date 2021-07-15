import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Container, Input, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";
import { PlayerSearchReturn } from "./CreateStaffAction";
import queryString from 'query-string'
import { StaffActionDetailForm } from "./StaffActionDetail";
import { useCookies } from "react-cookie";

export function StaffActionAddPlayer() {
    const [data, setData] = useState<StaffActionDetailForm>();

    const [cookies, setCookie] = useCookies();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchReturn, setSearchReturn] = useState<PlayerSearchReturn[]>();

    const [searchTermStaff, setSearchTermStaff] = useState<string>("");
    const [searchReturnStaff, setSearchReturnStaff] = useState<PlayerSearchReturn[]>();

    const [selectedPlayers, setSelectedPlayers] = useState<PlayerSearchReturn[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<PlayerSearchReturn[]>([]);

    const [error, setError] = useState<string | undefined>(undefined);

    const history = useHistory();

    const location = useLocation();
    const values = queryString.parse(location.search)
    const staffActionId = values.id;

    var isAdmin = cookies["isAdmin"]

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "staff-action/get-staff-action?id=" + staffActionId, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
                setSelectedPlayers(response.players);
                setSelectedStaff(response.staff);
            });
    }, []);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "user/search-profile?search=" + searchTerm, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSearchReturn(response);
            });
    }, [searchTerm]);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "user/search-staff?search=" + searchTermStaff, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSearchReturnStaff(response);
            });
    }, [searchTermStaff]);

    function addPlayerToSelectedPlayers(player: PlayerSearchReturn) {
        if (!selectedPlayers.includes(player)) {
            setSelectedPlayers(prev => {
                return [
                    ...prev,
                    player
                ]
            });
        }
    }

    function addStaffToSelectedStaff(player: PlayerSearchReturn) {
        if (!selectedStaff.includes(player)) {
            setSelectedStaff(prev => {
                return [
                    ...prev,
                    player
                ]
            });
        }
    }

    function handleClick() {
        var body = {
            staffActionId: data?.staffActionId,
            addedPlayerIds: selectedPlayers.map(p => p.discordUserId),
            addedStaffIds: selectedStaff.map(p => p.discordUserId)
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

        fetch(process.env.REACT_APP_BASE_URL + "staff-action/add-players", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/staff-action?id=" + data?.staffActionId));
    }

    return (
        <Container>
            <Jumbotron>
                <h1>{data?.title}</h1>
                <hr className="my-2" />

                <Label>Add players to Staff Action</Label>
                <Input
                    name="search"
                    value={searchTerm}
                    placeholder="Search players..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ButtonGroup className="mb-2">
                    {selectedPlayers?.map((player) => (
                        <Button key={player.discordUserId} disabled>{player.discordUserName}</Button>
                    ))}
                </ButtonGroup>

                <ListGroup>
                    {searchReturn?.map((player) => (
                        <ListGroupItem key={player.discordUserId} onClick={(e) => addPlayerToSelectedPlayers(player)}><Button>{player.discordUserName}</Button></ListGroupItem>
                    ))}
                </ListGroup>

                {isAdmin ?
                    <>
                        <Label>Add staff to Staff Action</Label>
                        <Input
                            name="searchStaff"
                            value={searchTermStaff}
                            placeholder="Search staff..."
                            onChange={(e) => setSearchTermStaff(e.target.value)}
                        />

                        <ListGroup>
                            {searchReturnStaff?.map((staff) => (
                                <ListGroupItem key={staff.discordUserId} onClick={(e) => addStaffToSelectedStaff(staff)}><Button>{staff.discordUserName}</Button></ListGroupItem>
                            ))}
                        </ListGroup>

                        <ButtonGroup className="mb-2">
                            {selectedStaff?.map((staff) => (
                                <Button key={staff.discordUserId} disabled>{staff.discordUserName}</Button>
                            ))}
                        </ButtonGroup>
                    </>
                    : null}

                <hr className="my-2" />

                <Button color="secondary" onClick={handleClick}>
                    Save
                </Button>
            </Jumbotron>
        </Container>
    )
}