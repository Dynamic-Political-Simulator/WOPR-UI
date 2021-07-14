import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, ButtonGroup, Container, Input, Jumbotron, Label, ListGroup, ListGroupItem } from "reactstrap";

interface AlignmentSearchReturn {
    alignmentId: string;
    alignmentName: string;
}

export function CreateClique() {
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string | undefined>(undefined);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchReturn, setSearchReturn] = useState<AlignmentSearchReturn[]>();
    const [selectedAlignments, setSelectedAlignments] = useState<AlignmentSearchReturn[]>([]);

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

        fetch(process.env.BASE_URL + "alignment/search-alignment?search=" + searchTerm, requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSearchReturn(response);
            });
    }, [searchTerm]);

    function handleClick() {
        var body = {
            cliqueName: name,
            alignmentIds: selectedAlignments.map(a => a.alignmentId)
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

        fetch(process.env.BASE_URL + "clique/create-clique", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => history.push("/my-cliques"))
    }

    function addAlignmentToSelecteAlignments(alignment: AlignmentSearchReturn) {
        if (!selectedAlignments.includes(alignment)){
            setSelectedAlignments(prev => {
                return [
                    ...prev,
                    alignment
                ]
            });
        }
    }

    return (
        <Container>
            <Jumbotron>
                <h1>Create Clique</h1>
                <hr className="my-2" />

                <Label>Name</Label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Label>Search Alignments</Label>
                <Input
                    name="search"
                    value={searchTerm}
                    placeholder="Search alignments..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ButtonGroup className="mb-2">
                    {selectedAlignments?.map((a) => (
                        <Button key={a.alignmentId} disabled>{a.alignmentName}</Button>
                    ))}
                </ButtonGroup>

                <ListGroup>
                    {searchReturn?.map((a) => (
                        <ListGroupItem key={a.alignmentId} onClick={(e) => addAlignmentToSelecteAlignments(a)}><Button>{a.alignmentName}</Button></ListGroupItem>
                    ))}
                </ListGroup>

                {error == undefined? null : <Alert color="Danger">Something went wrong. Please try again.</Alert>}

                <Button color="secondary" onClick={handleClick}>
                    Create
                </Button>
            </Jumbotron>
        </Container>
    )
}