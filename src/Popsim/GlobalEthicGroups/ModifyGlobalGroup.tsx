import { group } from "console";
import { type } from "os";
import React, { useEffect, useState, useReducer } from "react";
import { Input, Jumbotron, Label, Button } from "reactstrap";

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

function ModifyGlobalGroup() {
    const [time, setTime] = useState<number>(3);

    const [error, setError] = useState<string | undefined>(undefined);

    const [groups, setGroups] = useState<Group[]>([]);
    const [selected, setSelected] = useState<Group>();
    const [setting, setSet] = useState(false);

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

        fetch("https://localhost:44394/api/popsim/get-ggroups", requestInit)
            .then((response) => response.json())
            .then((response) => {
                setGroups(response);
                setSelected(response[0]);
            });
    }, [])

    function setGroup() {
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

        fetch("https://localhost:44394/api/popsim/set-group", requestInit)
            .then((response) => {
                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                fetch("https://localhost:44394/api/popsim/get-ggroups", requestInit)
                    .then((response) => response.json())
                    .then((response) => {
                        setGroups(response);
                        setSelected(response[0]);
                        setSet(false);
                    });
            });
    }

    return (
        <div>
            <Jumbotron>
                <h1>Modify Group</h1>
                <Input type="select" disabled={groups.length === 0} value={groups.length === 0 ? "Loading..." : selected?.name} onChange={(e) => setSelected(groups.find(x => x.name == e.target.value))}>
                    {groups.length === 0 ?
                        <option>Loading...</option>
                        :
                        groups.map(x => {
                            return <option>{x.name}</option>
                        })}
                </Input>
                <br />
                <Label>Involvement Factor:</Label>
                <Input type="number" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.partyInvolvementFactor} onChange={(e) => {
                    let x = selected;
                    x!.partyInvolvementFactor = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Radicalisation:</Label>
                <Input type="number" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.radicalisation} onChange={(e) => {
                    let x = selected;
                    x!.radicalisation = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Enlistment Modifier:</Label>
                <Input type="number" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.popGroupEnlistment} onChange={(e) => {
                    let x = selected;
                    x!.popGroupEnlistment = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <br />
                <Label>Federalism - Centralism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.federalismCentralism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.federalismCentralism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Democracy - Authority</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.democracyAuthority} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.democracyAuthority = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Globalism - Isolationism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.globalismIsolationism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.globalismIsolationism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Militarism - Pacifism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.militarismPacifism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.militarismPacifism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Security - Freedom</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.securityFreedom} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.securityFreedom = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Cooperation - Competition</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.cooperationCompetition} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.cooperationCompetition = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Secularism - Spiritualism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.secularismSpiritualism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.secularismSpiritualism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Progresivism - Traditionalism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.progressivismTraditionalism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.progressivismTraditionalism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Label>Monoculturalism - Multiculturalism</Label>
                <Input type="range" disabled={groups.length === 0} value={groups.length === 0 ? "N/A" : selected?.monoculturalismMulticulturalism} min={0} max={10} step={1} onChange={(e) => {
                    let x = selected;
                    x!.monoculturalismMulticulturalism = parseInt(e.target.value);
                    setSelected(x);
                    forceUpdate();
                }}></Input>
                <br />
                <Button color="secondary" disabled={setting} onClick={setGroup}>
                    Update
                </Button>
            </Jumbotron>
        </div>
    )
}

export default ModifyGlobalGroup;