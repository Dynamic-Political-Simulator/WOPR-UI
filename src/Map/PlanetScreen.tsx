import { render } from '@testing-library/react';
import { Console, group } from 'console';
import { stringify } from 'query-string';
import React, { useEffect, useState, useReducer } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';

class PopEntry {
    name: string = "";
    amount: number = 0;
}

class GroupEntry {
    Name: string = "";
    CurrMod?: string = undefined;
    Modifier?: Map<string, string> = new Map<string, string>();
    Size: string = "";

    toSend(): GroupEntrySend {
        let res = new GroupEntrySend();
        res.name = this.Name;
        this.Modifier?.forEach((v, k, t) => {
            res.modifier![k] = parseInt(v);
        });
        res.size = parseInt(this.Size);
        return res;
    }
}

class GroupEntrySend {
    name: string = "";
    modifier?: { [id: string]: number } = {};
    size: number = 0;

    constructor() { }

    static toLocal(og: GroupEntrySend, defalign: string): GroupEntry {
        let res = new GroupEntry();
        res.Name = og.name;
        for (let tmp in og.modifier!) {
            console.log(tmp);
            res.Modifier?.set(tmp, og.modifier![tmp].toString());
        }
        res.Size = og.size.toString();
        res.CurrMod = defalign;
        return res;
    }
}

class IndustryEntry {
    Name: string = "";
    GDP: number = 0;
    Modifier: string = "";

    toSend(): IndustryEntrySend {
        let res = new IndustryEntrySend();
        res.name = this.Name;
        res.gdp = this.GDP;
        res.modifier = parseInt(this.Modifier);
        return res;
    }
}

class IndustryEntrySend {
    name: string = "";
    gdp: number = 0;
    modifier: number = 0;

    static toLocal(og: IndustryEntrySend): IndustryEntry {
        let res = new IndustryEntry();
        res.Name = og.name;
        res.GDP = og.gdp;
        res.Modifier = og.modifier?.toString();
        return res;
    }
}

class PlanetData {
    name: string = "";
    population: number = 0;
    officeAlignments: string[] = [];
    groupEntries: GroupEntrySend[] = [];
    industryEntries: IndustryEntrySend[] = [];
    species: PopEntry[] = [];
}

enum STATE {
    Loading,
    Loaded,
    Errored
}

export function Planet() {
    const history = useHistory();
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState(STATE.Loading);
    const [expanded, setExpanded] = useState(false);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [planetName, setPlanetName] = useState("Planet Name");
    const [population, setPopulation] = useState(420420420420);
    const [pops, setPops] = useState<PopEntry[]>([
        {
            name: "Human",
            amount: 70
        },
        {
            name: "Liaran",
            amount: 30
        }
    ]);
    const [alignments, setAlignments] = useState<string[]>([
        "Conservative",
        "Reformist",
        "Ultrafederalist"
    ].reverse());
    const [groups, setGroups] = useState<GroupEntry[]>([]);
    const [industryModifiers, setIndustryMods] = useState<IndustryEntry[]>([]);

    const [data, setData] = useState<string[]>();
    const [alignmentData, setAlignmentData] = useState<string[]>([
        "Conservative",
        "Reformist",
        "Ultrafederalist",
        "Hardliner"
    ]);

    const { name } = useParams<{ name: string }>();

    function beautifyOutputEntry(name: string): string {
        if (name === "pmcs") return "PMCs" // special case since it's an abbreviation
        return name.split("_").map(x => x[0].toUpperCase() + x.substring(1)).join(" ");
    }

    function intToString(num: number) {
        if (num < 1000) {
            return num;
        }
        var si = [
            { v: 1E3, s: "K" },
            { v: 1E6, s: "M" },
            { v: 1E9, s: "B" },
            { v: 1E12, s: "T" },
            { v: 1E15, s: "P" },
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

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/clique/get-alignments", requestInit)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
                //@ts-ignore
                let alignmento: string[] = response;
                setAlignmentData(response);
                console.table(alignmentData);

                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                fetch("https://localhost:44394/api/map/get-planet?name=" + name, requestInit)
                    .then((response) => response.json())
                    .then((response) => {
                        try {
                            let planet: PlanetData = response;
                            setPopulation(planet.population);
                            setPlanetName(planet.name);

                            setAlignments(planet.officeAlignments);

                            setGroups(planet.groupEntries.map((x: GroupEntrySend) => GroupEntrySend.toLocal(x, alignmento[0])));
                            setIndustryMods(planet.industryEntries.map((x: IndustryEntrySend) => IndustryEntrySend.toLocal(x)));
                            setPops(planet.species);
                            setState(STATE.Loaded);
                        } catch {
                            setState(STATE.Errored);
                        }
                    });
            });
    }, []);

    function submitEdit() {
        let planet = new PlanetData();
        planet.population = population;
        planet.name = planetName;

        planet.officeAlignments = alignments;

        planet.groupEntries = groups.map(x => x.toSend());
        planet.industryEntries = industryModifiers.map(x => x.toSend());

        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planet)
        };

        fetch("https://localhost:44394/api/map/edit-planet", requestInit)
            .then((response) => response.json())
            .then((response) => {
                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: name
                };

                fetch("https://localhost:44394/api/map/get-planet", requestInit)
                    .then((response) => response.json())
                    .then((response) => {
                        let planet: PlanetData = response;
                        setPopulation(planet.population);
                        setPlanetName(planet.name);

                        setAlignments(planet.officeAlignments);

                        setGroups(planet.groupEntries.map((x: GroupEntrySend) => GroupEntrySend.toLocal(x, alignmentData[0])));
                        setIndustryMods(planet.industryEntries.map((x: IndustryEntrySend) => IndustryEntrySend.toLocal(x)));
                        setPops(planet.species);
                    });
            });
    }

    if (state == STATE.Loading) {
        return (
            <div className="planetScreen">
                <h1><b>{name}</b></h1>
                <hr style={{
                    borderTop: "2px solid lime"
                }} />
                Loading...
            </div>
        )
    }

    if (state == STATE.Errored) {
        return (
            <div className="planetScreen">
                <h1><b>{name}</b></h1>
                <hr style={{
                    borderTop: "2px solid lime"
                }} />
                Invalid planet. If you are absolutely certain you entered it correctly, please tell staff.
            </div>
        )
    }

    let gdpSum = 0;
    if (industryModifiers.length > 0) gdpSum = industryModifiers.map(x => x.GDP).reduce((a, b) => a + b);

    if (!edit) {
        return (
            <div className="planetScreen">
                <h1><b>{planetName}</b></h1>
                <hr style={{
                    borderTop: "2px solid lime"
                }} />
                <b>Population:</b> <span>{intToString(population)}</span><br /><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Species
                    </th>
                            <th>
                                Proportion
                    </th>
                        </tr>
                        {pops?.map((spe) => (
                            <tr key={spe.name}>
                                <td>
                                    {spe.name}
                                </td>
                                <td>
                                    {spe.amount}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Office
                    </th>
                            <th>
                                Alignment
                    </th>
                        </tr>
                        <tr>
                            <td>
                                Executive
                    </td>
                            <td>
                                {alignments[0]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Legislative
                    </td>
                            <td>
                                {alignments[1]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Party
                    </td>
                            <td>
                                {alignments[2]}
                            </td>
                        </tr>
                    </tbody>
                </table><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Group
                    </th>
                            <th>
                                Size
                    </th>
                        </tr>
                        {
                            groups.map((g) => (<tr>
                                <td>
                                    {g.Name}
                                </td>
                                <td>
                                    {g.Size}
                                </td>
                            </tr>))}
                    </tbody>
                </table>
                <br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Industry
                    </th>
                            <th>
                                GDP
                    </th>
                            <th>
                                % of Total
                    </th>
                        </tr>
                        {industryModifiers?.sort((a, b) => a.GDP - b.GDP).map((spe) => (
                            <tr key={spe.Name}>
                                <td>
                                    {beautifyOutputEntry(spe.Name)}
                                </td>
                                <td>
                                    {intToString(spe.GDP)}
                                </td>
                                <td>
                                    {Math.floor((spe.GDP / gdpSum) * 100)}%
                                </td>
                            </tr>
                        )).reverse().slice(0, !expanded ? 10 : undefined)}
                    </tbody>
                </table>
                <Button onClick={() => setExpanded(!expanded)}>{!expanded ? "Expand" : "Collapse"}</Button>
                <br /><br />
                <Button onClick={() => history.push("/map")}>Back</Button>&nbsp;<Button onClick={() => setEdit(true)}>Edit</Button>
            </div>
        )
    } else {
        return (
            <div className="planetScreen">
                <h1><b>{planetName}</b> <span style={{ color: "red" }}>(Edit Mode)</span></h1>
                <hr style={{
                    borderTop: "2px solid lime"
                }} />
                <b>Population:</b> <span>{population.toLocaleString()}</span><br /><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Species
                    </th>
                            <th>
                                Proportion
                    </th>
                        </tr>
                        {pops?.map((spe) => (
                            <tr key={spe.name}>
                                <td>
                                    {spe.name}
                                </td>
                                <td>
                                    {spe.amount}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Office
                    </th>
                            <th>
                                Alignment
                    </th>
                        </tr>
                        <tr>
                            <td>
                                Executive
                    </td>
                            <td>
                                <Input
                                    type="select"
                                    value={alignments[0]}
                                    onChange={(e) => {
                                        let b = alignments;
                                        b[0] = e.target.value;
                                        setAlignments(b);
                                        forceUpdate(); // react sucks balls
                                    }}
                                >
                                    {alignmentData?.map((a) => (<option>{a}</option>))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Legislative
                    </td>
                            <td>
                                <Input
                                    type="select"
                                    value={alignments[1]}
                                    onChange={(e) => {
                                        let b = alignments;
                                        b[1] = e.target.value;
                                        setAlignments(b);
                                        forceUpdate();
                                    }}
                                >
                                    {alignmentData?.map((a) => (<option>{a}</option>))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Party
                    </td>
                            <td>
                                <Input
                                    type="select"
                                    value={alignments[2]}
                                    onChange={(e) => {
                                        let b = alignments;
                                        b[2] = e.target.value;
                                        setAlignments(b);
                                        forceUpdate();
                                    }}
                                >
                                    {alignmentData?.map((a) => (<option>{a}</option>))}
                                </Input>
                            </td>
                        </tr>
                    </tbody>
                </table><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Group
                    </th>
                            <th>
                                Size
                    </th>
                            <th>
                                Alignment
                    </th>
                            <th>
                                Modifier
                    </th>
                            <th></th>
                        </tr>
                        {
                            groups.map((g) => (<tr>
                                <td>
                                    <Input
                                        type="text"
                                        value={g.Name}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].Name = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="text"
                                        value={g.Size}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].Size = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={g.CurrMod == undefined ? alignmentData[0] : g.CurrMod!}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].CurrMod = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    >
                                        {alignmentData?.map((a) => (<option>{a}</option>))}
                                    </Input>
                                </td>
                                <td>
                                    {<Input
                                        type="text"
                                        value={g.CurrMod != undefined ? g.Modifier?.has(g.CurrMod) ? g.Modifier?.get(g.CurrMod) : 0 : "undefined"}
                                        disabled={g.CurrMod == undefined}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].Modifier?.set(g.CurrMod!, e.target.value);
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />}
                                </td>
                                <td>
                                    <Button onClick={(e) => {
                                        let b = groups;
                                        let ind = b.indexOf(g);
                                        if (ind > -1)
                                            b.splice(ind, 1);
                                        setGroups(b);
                                        forceUpdate();
                                    }}>Remove</Button>
                                </td>
                            </tr>))}
                        <tr>
                            <td>
                                <Button
                                    onClick={(e) => {
                                        let b = groups;
                                        let x = new GroupEntry();
                                        x.CurrMod = alignmentData[0];
                                        b.push(x);
                                        setGroups(b);
                                        forceUpdate();
                                    }}>Add</Button>
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <br /><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Industry
                    </th>
                            <th>
                                Modifier
                    </th>
                        </tr>
                        {
                            industryModifiers.sort((a, b) => a.GDP - b.GDP).reverse().map((m) => (<tr>
                                <td>
                                    <Input
                                        type="text"
                                        value={m.Name}
                                        onChange={(e) => {
                                            let b = industryModifiers;
                                            b[b.indexOf(m)].Name = e.target.value;
                                            setIndustryMods(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="text"
                                        value={m.Modifier}
                                        onChange={(e) => {
                                            let b = industryModifiers;
                                            b[b.indexOf(m)].Modifier = e.target.value;
                                            setIndustryMods(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                            </tr>))}
                    </tbody>
                </table>
                <br /><br />
                <Button onClick={() => {
                    // Run a thing that saves everything and sends it to the server
                    submitEdit();
                    setEdit(false);
                }}>Save</Button>
            </div>
        )
    }
}