import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Jumbotron, Label } from 'reactstrap';

interface PlayerSearchReturn {
    discordUserId: string;
    discordUserName: string;
    isAdmin: boolean;
}

export function CreateStaffAction() {
    const [title, setTitle] = useState<string>();
    const [firstPost, setFirstPost] = useState<string>();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchReturn, setSearchReturn] = useState<PlayerSearchReturn[]>();

    const [selectedPlayers, setSelectedPlayers] = useState<PlayerSearchReturn[]>([]);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [error, setError] = useState<string | undefined>(undefined);

    const history = useHistory();

    const toggle = () => setDropdownOpen(prevState => !prevState);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/user/search-profile?search=" + searchTerm, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSearchReturn(response);
            });
    }, [searchTerm]);

    function addPlayerToSelectedPlayers(player: PlayerSearchReturn) {
        setSelectedPlayers(prev => {
            return [
                ...prev,
                player
            ]
        });
    }

    function handleClick(){
        var body = {
            title: title,
            firstPost: firstPost,
            addedPlayerIds: selectedPlayers.map(p => p.discordUserId)
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

        fetch("https://localhost:44394/api/staff-action/create-staff-action", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/my-staff-actions"));
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Staff Actions</h1>

                <hr className="my-2" />

                <Label>Title</Label>
                <Input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Label>Content</Label>
                <Input
                    name="firstPost"
                    value={firstPost}
                    className="mb-2"
                    onChange={(e) => setFirstPost(e.target.value)}
                />

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

                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>
                        Results
                    </DropdownToggle>
                    <DropdownMenu>
                        {searchReturn?.map((player) => (
                            <DropdownItem key={player.discordUserId} onClick={(e) => addPlayerToSelectedPlayers(player)}>{player.discordUserName}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <hr className="my-2" />

                <Button color="secondary" onClick={handleClick}>
                    Create
                </Button>

            </Jumbotron>
        </Container>
    )
}