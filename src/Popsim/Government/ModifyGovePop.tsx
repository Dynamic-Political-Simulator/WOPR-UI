import React, { useEffect, useState, useReducer } from "react";
import { Input, Jumbotron, Label, Button } from "reactstrap";

class GovernmentBranch {
    id: string = "";
    name: string = "";
    perceivedAlignment: string = "";
    natMod: number = 0;

    modifier?: { [id: string]: number } = {};
}

class Group {
    /*
        public string PopsimGlobalEthicGroupName { get; set; }

        public int PartyInvolvementFactor { get; set; }
        public float Radicalisation { get; set; }
        public float PartyEnlistmentModifier { get; set; }

        public virtual List < PopsimPlanetEthicGroup > PlanetaryEthicGroups { get; set; }

        public int FederalismCentralism { get; set; }
        public int DemocracyAuthority { get; set; }
        public int GlobalismIsolationism { get; set; }
        public int MilitarismPacifism { get; set; }
        public int SecurityFreedom { get; set; }
        public int CooperationCompetition { get; set; }
        public int SecularismSpiritualism { get; set; }
        public int ProgressivismTraditionalism { get; set; }
        public int MonoculturalismMulticulturalism { get; set; }
    */
    name: string = "";
    partyInvolvementFactor: number = 1;
    radicalisation: number = 1;
    popGroupEnlistment: number = 1;

    federalismCentralism: number = 5;
    democracyAuthority: number = 5;
    globalismIsolationism: number = 5;
    militarismPacifism: number = 5;
    securityFreedom: number = 5;
    cooperationCompetition: number = 5;
    secularismSpiritualism: number = 5;
    progressivismTraditionalism: number = 5;
    monoculturalismMulticulturalism: number = 5;
}

function ModifyGovePop() {
    const [time, setTime] = useState<number>(3);

    const [error, setError] = useState<string | undefined>(undefined);

    const [branches, setBranches] = useState<GovernmentBranch[]>([]);
    const [selected, setSelected] = useState<GovernmentBranch>();
    const [setting, setSet] = useState(false);
    const [groups, setGroups] = useState<string[]>([]);

    const [alignmentData, setAlignmentData] = useState<string[]>([
        "Conservative",
        "Reformist",
        "Ultrafederalist",
        "Hardliner"
    ]);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "clique/get-alignments", requestInit)
            .then((response) => response.json())
            .then((response) => {
                //@ts-ignore
                setAlignmentData(response);
                fetch(process.env.REACT_APP_BASE_URL + "popsim/get-ggroups", requestInit)
                    .then((response) => response.json())
                    .then((responsee) => {
                        setGroups((responsee as Group[]).map(x => x.name));
                        fetch(process.env.REACT_APP_BASE_URL + "popsim/get-gov-edit", requestInit)
                            .then((response) => response.json())
                            .then((responseee) => {
                                setBranches(responseee);
                                setSelected(responseee[0]);
                                console.table(responseee);
                            });
                    });
            });
    }, [])

    function setGov() {
        setSet(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selected)
        };

        fetch(process.env.REACT_APP_BASE_URL + "popsim/set-gov", requestInit)
            .then((response) => {
                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                fetch(process.env.REACT_APP_BASE_URL + "popsim/get-ggroups", requestInit)
                    .then((response) => response.json())
                    .then((responsee) => {
                        setGroups((responsee as Group[]).map(x => x.name));
                        fetch(process.env.REACT_APP_BASE_URL + "popsim/get-gov-edit", requestInit)
                            .then((response) => response.json())
                            .then((responseee) => {
                                setBranches(responseee);
                                console.table(responseee);
                                setSet(false);
                            });
                    });
            });
    }

    function makeGov() {
        setSet(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "popsim/make-gov", requestInit)
            .then((response) => {
                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                fetch(process.env.REACT_APP_BASE_URL + "popsim/get-ggroups", requestInit)
                    .then((response) => response.json())
                    .then((responsee) => {
                        setGroups((responsee as Group[]).map(x => x.name));
                        fetch(process.env.REACT_APP_BASE_URL + "popsim/get-gov-edit", requestInit)
                            .then((response) => response.json())
                            .then((responseee) => {
                                setBranches(responseee);
                                console.table(responseee);
                                setSet(false);
                            });
                    });
            });
    }

    return (
        <div>
            <Jumbotron>
                <h1>Modify Group</h1>
                <Input type="select" disabled={branches.length === 0} value={branches.length === 0 ? "Loading..." : selected?.name} onChange={(e) => setSelected(branches.find(x => x.name == e.target.value))}>
                    {branches.length === 0 ?
                        <option>Loading...</option>
                        :
                        branches.map(x => {
                            return <option>{x.name}</option>
                        })}
                </Input>
                <br />
                <Label>Name</Label>
                <Input type="text" disabled={branches.length === 0} value={branches.length === 0 ? "N/A" : selected?.name} onChange={(e) => {
                    let x = selected;
                    x!.name = e.target.value;
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Alignment</Label>
                <Input type="select" disabled={branches.length === 0} value={branches.length === 0 ? "N/A" : selected?.perceivedAlignment} onChange={(e) => {
                    let x = selected;
                    x!.perceivedAlignment = e.target.value;
                    setSelected(x);
                    forceUpdate();
                }}>
                    {alignmentData.map(al => (<option>{al}</option>))}
                </Input>
                <br />
                <Label>National Modifier</Label>
                <Input type="number" disabled={branches.length === 0} value={branches.length === 0 ? 0 : selected?.natMod} onChange={(e) => {
                    let x = selected;
                    x!.natMod = e.target.valueAsNumber;
                    setSelected(x);
                    forceUpdate();
                }}>
                </Input>
                <br />
                <table>
                    <tbody>
                        <tr>
                            <th>
                                Group
                            </th>
                            <th>
                                Modifier
                            </th>
                        </tr>
                        {groups.map(x => (
                            <tr>
                                <td>{x}</td>
                                <td>
                                    <Input
                                        type="number"
                                        value={selected !== undefined ? selected!.modifier![x] : 0}
                                        disabled={branches.length === 0}
                                        onChange={(e) => {
                                            let newData = selected;
                                            newData!.modifier![x] = e.target.valueAsNumber;
                                            setSelected(newData);
                                            forceUpdate();
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <Button color="secondary" disabled={setting} onClick={setGov}>
                    Update
                </Button>
                <Button color="secondary" disabled={setting} onClick={makeGov}>
                    New
                </Button>
            </Jumbotron>
        </div>
    )
}

export default ModifyGovePop;