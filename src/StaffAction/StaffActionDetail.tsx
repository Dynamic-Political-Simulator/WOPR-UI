import React, { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, Container, Input, Jumbotron, Media } from "reactstrap";
import queryString from 'query-string'
import { useHistory, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

interface DiscordUser {
    discordUserId: string;
    userName: string;
}

interface StaffActionPost {
    postId: string;
    author: DiscordUser;
    timePosted: string;
    content: string;
}

export interface StaffActionDetailForm {
    staffActionId: string;
    title: string;

    timeCreated: string;

    owner: DiscordUser;
    players: DiscordUser[];
    staff: DiscordUser[];

    staffActionPosts: StaffActionPost[];
}

interface PostForm {
    staffActionId: string;
    postContent: string;
}

export function StaffActionDetail() {
    const [data, setData] = useState<StaffActionDetailForm>();
    const [newPost, setNewPost] = useState<string>('');

    const [cookies, setCookie] = useCookies();

    const history = useHistory();
    const location = useLocation();
    const values = queryString.parse(location.search)
    const staffActionId = values.id;

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/staff-action/get-staff-action?id=" + staffActionId, requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }, []);

    function handleClick() {
        var body: PostForm = {
            // @ts-ignore
            staffActionId: data?.staffActionId,
            postContent: newPost
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

        fetch("https://localhost:44394/api/staff-action/post", requestInit)
            .then(() => history.go(0));
    }

    function handleAddClick() {
        history.push('/staff-action-add?id=' + staffActionId)
    }

    return (
        <Container>
            <Jumbotron>
                <h1>{data?.title}</h1>
                <p>Players:</p>
                <ButtonGroup>
                    <Button key={data?.owner.discordUserId} disabled>{data?.owner.userName}</Button>
                    {data?.players.map((i) => (
                        <Button key={i.discordUserId} disabled>{i.userName}</Button>
                    ))}
                    <Button onClick={handleAddClick}>+</Button>
                </ButtonGroup>

                <p>Staff:</p>
                <ButtonGroup>
                    {data?.staff.map((i) => (
                        <Button key={i.discordUserId} disabled>{i.userName}</Button>
                    ))}
                    <Button onClick={handleAddClick}>+</Button>
                </ButtonGroup>
                
                <hr className="my-2"/>

                {data?.staffActionPosts.map((i) => (
                    <Alert key={i.postId} color="dark">
                        <b>{i.author.userName} : {new Date(i.timePosted).toLocaleString('en-GB')}</b>
                        <br/>
                        {i.content}
                    </Alert>
                ))}

                <Input
                    type="textarea"
                    name="newPost"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <Button onClick={handleClick}>
                    Post
                </Button>
                
            </Jumbotron>
        </Container>
    )
}

interface props {
    post: StaffActionPost
}

function StaffActionPost(props: props) {

    return(
        <p>p</p>
    )
}