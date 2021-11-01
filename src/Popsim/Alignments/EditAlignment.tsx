import { useHistory, useLocation } from "react-router-dom";
import queryString from 'query-string'
import { Button, Container, Input, Jumbotron, Label } from "reactstrap";
import { useEffect, useState } from "react";
import { AlignmentOverview } from "./PopsimAlignments";

export function EditAlignment() {
    const [data, setData] = useState<AlignmentOverview | undefined>(undefined);

    const location = useLocation();
    const history = useHistory();

    const values = queryString.parse(location.search)

    const characterId = values.id;

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "alignment/get-alignment?id=" + characterId, requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }, []);

    function handleClick() {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        fetch(process.env.REACT_APP_BASE_URL + "alignment/edit-alignment", requestInit)
            .then((response) => {
                if (response.ok) {
                    history.push("/alignments");
                }
            });
    }

    return (
        <>
            {data == undefined ? <div>loading</div> :
                <Container>
                    <Jumbotron >
                        <Label>Alignment name</Label>
                        <Input
                            name="alignmentName"
                            value={data.alignmentName}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.alignmentName = e.target.value;
                                setData(newData);
                            }}
                        />

                        <Label>Establishment</Label>
                        <Input
                            name="establishment"
                            type="number"
                            value={data.establishment}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.establishment = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Federalism - Centralism</Label>
                        <Input
                            name="federalism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.federalismCentralism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.federalismCentralism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Democracy - Authority</Label>
                        <Input
                            name="democracy"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.democracyAuthority}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.democracyAuthority = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Globalism - Isolationism</Label>
                        <Input
                            name="globalism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.globalismIsolationism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.globalismIsolationism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Militarism - Pacifism</Label>
                        <Input
                            name="militarism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.militarismPacifism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.militarismPacifism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Security - Freedom</Label>
                        <Input
                            name="security"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.securityFreedom}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.securityFreedom = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Cooperation - Competition</Label>
                        <Input
                            name="cooperation"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.cooperationCompetition}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.cooperationCompetition = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Secularism - Spiritualism</Label>
                        <Input
                            name="secularism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.secularismSpiritualism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.secularismSpiritualism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Progressivism - Traditionalism</Label>
                        <Input
                            name="progressivism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.progressivismTraditionalism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.progressivismTraditionalism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Label>Monoculturalism - Multiculturalism</Label>
                        <Input
                            name="monoculturalism"
                            type="number"
                            min={0}
                            max={10}
                            step={1}
                            value={data.monoculturalismMulticulturalism}
                            onChange={(e) => {
                                let newData = Object.assign({}, data);
                                newData.monoculturalismMulticulturalism = e.target.valueAsNumber;
                                setData(newData);
                            }}
                        />

                        <Button onClick={handleClick} className="mt-1">
                            Save
                        </Button>
                    </Jumbotron>
                </Container>}
        </>
    )
}