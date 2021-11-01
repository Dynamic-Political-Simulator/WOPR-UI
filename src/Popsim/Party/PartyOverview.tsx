import { useEffect, useReducer } from "react";
import { useState } from "react"
import { Tab } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Button, Container, Jumbotron, Label, Table } from "reactstrap";
import { transpileModule } from "typescript";
import { useCookies } from 'react-cookie';

interface PopsimPartyOverviewReturn {
    /*
            public float OverallPartyEnlistment;
            public Dictionary<string, float> PerGroupEnlistment;
            public float UpperPartyMembership;
            public float LowerPartyMembership;
            public string UpperAlignment;
            public string LowerAlignment;
            public string UpperDominantFaction;
            public string LowerDominantFaction;
    */
    overallPartyEnlistment: number;
    percentageOfEmpire: number;
    perGroupEnlistment: { [id: string]: number };
    upperPartyMembership: number;
    lowerPartyMembership: number;
    upperAlignment: string;
    lowerAlignment: string;
    upperDominantFaction: string;
    lowerDominantFaction: string;
    upperPercentage: number;
}

class PartyResp {
    upperPercentage: number = 0;

    constructor(p: number) {
        this.upperPercentage = p;
        return this;
    }
}

export function PartyOverview() {
    const [data, setData] = useState<PopsimPartyOverviewReturn>();
    const [cookies, setCookie] = useCookies();
    const [edit, setEdit] = useState(false);
    const [saving, setSave] = useState(false);
    const [editp, setEditP] = useState<PartyResp>();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

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

        fetch(process.env.REACT_APP_BASE_URL + "popsim/get-party", requestInit)
            .then((response) => response.json())
            .then((response) => { setData(response); setEditP(new PartyResp(response.upperPercentage)) });
    });

    function intToString(num: number) {
        if (num < 1000) {
            return num;
        }
        var si = [
            { v: 1E3, s: "K" },
            { v: 1E6, s: "M" },
            { v: 1E9, s: "B" },
            { v: 1E12, s: "T" },
            { v: 1E15, s: "Q" },
            { v: 1E18, s: "E" }
        ];
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].v) {
                break;
            }
        }
        return (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s;
    }

    function save() {
        setSave(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editp)
        };

        fetch(process.env.REACT_APP_BASE_URL + "popsim/set-party", requestInit)
            .then((response) => { setSave(false); setEdit(false); })
            .catch(() => history.push("/"));
    }

    function generateList(): JSX.Element[] {
        let res: JSX.Element[] = [];
        for (let tmp in data!.perGroupEnlistment!) {
            res.push((<li>{tmp} - {(data!.perGroupEnlistment![tmp] * 100).toFixed(2)}%</li>));
        }
        return res;
    }

    if (edit) {
        return (
            <div className="planetScreen">
                <h1>The Party</h1>
                <hr style={{
                    borderTop: "1px solid var(--colour)"
                }} />
                {
                    data == undefined ? <div>Loading...</div> :
                        <div>
                            Upper Party Modifier: <input type="number" onChange={(e) => {
                                let newData = editp;
                                newData!.upperPercentage = e.target.valueAsNumber;
                                setEditP(newData);
                                forceUpdate();
                            }} />
                            <Button onClick={save} disabled={saving}>Save</Button>
                        </div>
                }
            </div>
        )
    }

    return (
        <div className="planetScreen">
            <h1>The Party</h1>
            <hr style={{
                borderTop: "1px solid var(--colour)"
            }} />
            {
                data == undefined ? <div>Loading...</div> :
                    <div>
                        Members: {intToString(data.overallPartyEnlistment)} ({(data.percentageOfEmpire * 100).toFixed(2)}%)<br />
                        Enlistment per Group:
                        <ul>
                            {generateList()}
                        </ul>
                        <table className="partyTable">
                            <tbody className="partyTable">
                                <td>
                                    <h2>Lower Party</h2>
                                    Members: {intToString(data.lowerPartyMembership)} <br />
                                    Leaning Alignment: {data.lowerAlignment} <br />
                                    Dominant Faction: {data.lowerDominantFaction}
                                </td>
                                <td>
                                    <h2>Upper Party</h2>
                                    Members: {intToString(data.upperPartyMembership)} <br />
                                    Leaning Alignment: {data.upperAlignment} <br />
                                    Dominant Faction: {data.upperDominantFaction}
                                </td>
                            </tbody>
                        </table>
                        <Button onClick={() => setEdit(true)} hidden={cookies["isAdmin"] === "false"}>Edit</Button>
                    </div>
            }
        </div>
    )
}