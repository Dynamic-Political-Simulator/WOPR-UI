import { render } from '@testing-library/react';
import { Console, group } from 'console';
import React, { useEffect, useState, useReducer } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';

class PopEntry {
    species: string = "";
    amount: string = "0";
}

class GroupEntry {
    Name: string = "";
    Modifier?: Map<string, string> = new Map<string, string>();
    Size: string = "";

    toSend(): GroupEntrySend {
        let res = new GroupEntrySend();
        res.Name = this.Name;
        this.Modifier?.forEach((v, k, t) => {
            res.Modifier?.set(k, parseInt(v));
        });
        res.Size = parseInt(this.Size);
        return res;
    }
}

class GroupEntrySend {
    Name: string = "";
    Modifier?: Map<string, number> = new Map<string, number>();
    Size: number = 0;

    toLocal(): GroupEntry {
        let res = new GroupEntry();
        res.Name = this.Name;
        this.Modifier?.forEach((v, k, t) => {
            res.Modifier?.set(k, v.toString());
        });
        res.Size = this.Size.toString();
        return res;
    }
}

class IndustryEntry {
    Name: string = "";
    GDP: number = 0;
    Modifier: string = "";

    toSend(): IndustryEntrySend {
        let res = new IndustryEntrySend();
        res.Name = this.Name;
        res.GDP = this.GDP;
        res.Modifier = parseInt(this.Modifier);
        return res;
    }
}

class IndustryEntrySend {
    Name: string = "";
    GDP: number = 0;
    Modifier: number = 0;

    toLocal(): IndustryEntry {
        let res = new IndustryEntry();
        res.Name = this.Name;
        res.GDP = this.GDP;
        res.Modifier = this.Modifier?.toString();
        return res;
    }
}

class PlanetData {
    Name: string = "";
    Population: number = 0;
    OfficeAlignments: string[] = [];
    GroupEntries: GroupEntrySend[] = [];
    IndustryEntries: IndustryEntrySend[] = [];
}

export function Planet() {
    const history = useHistory();
    const [edit, setEdit] = useState(false);
    const [species, setSpecies] = useState<string>();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [planetName, setPlanetName] = useState("Planet Name");
    const [population, setPopulation] = useState(420420420420);
    const [pops, setPops] = useState<PopEntry[]>([
        {
            species: "Human",
            amount: "70"
        },
        {
            species: "Liaran",
            amount: "30"
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

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/character/get-species", requestInit)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
                //@ts-ignore
                setSpecies(response[0]);
            });

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
                setAlignmentData(response[0]);
            });

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
                let planet = response as PlanetData;
                setPopulation(planet.Population);
                setPlanetName(planet.Name);

                setAlignments(planet.OfficeAlignments);

                setGroups(planet.GroupEntries.map(x => x.toLocal()));
                setIndustryMods(planet.IndustryEntries.map(x => x.toLocal()));
            });
    }, []);

    function submitEdit() {
        let planet = new PlanetData();
        planet.Population = population;
        planet.Name = planetName;

        planet.OfficeAlignments = alignments;

        planet.GroupEntries = groups.map(x => x.toSend());
        planet.IndustryEntries = industryModifiers.map(x => x.toSend());

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
                        let planet = response as PlanetData;
                        setPopulation(planet.Population);
                        setPlanetName(planet.Name);

                        setAlignments(planet.OfficeAlignments);

                        setGroups(planet.GroupEntries.map(x => x.toLocal()));
                        setIndustryMods(planet.IndustryEntries.map(x => x.toLocal()));
                    });
            });
    }

    let gdpSum = industryModifiers.map(x => x.GDP).reduce((a, b) => a + b);

    if (!edit) {
        return (
            <div className="planetScreen">
                <h1><b>{planetName}</b></h1>
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
                            <tr key={spe.species}>
                                <td>
                                    {spe.species}
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
                        {industryModifiers?.map((spe) => (
                            <tr key={spe.Name}>
                                <td>
                                    {spe.Name}
                                </td>
                                <td>
                                    {spe.GDP}
                                </td>
                                <td>
                                    {Math.floor((spe.GDP / gdpSum) * 100)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            <tr key={spe.species}>
                                <td>
                                    {spe.species}
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
                                    {/*<Input
                                        type="text"
                                        value={g.modifier}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].modifier = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />*/}
                                    WIP
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
                            <th></th>
                        </tr>
                        {
                            industryModifiers.map((m) => (<tr>
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
                                <td>
                                    <Button onClick={(e) => {
                                        let b = industryModifiers;
                                        let ind = b.indexOf(m);
                                        if (ind > -1)
                                            b.splice(ind, 1);
                                        setIndustryMods(b);
                                        forceUpdate();
                                    }}>Remove</Button>
                                </td>
                            </tr>))}
                        <tr>
                            <td>
                                <Button
                                    onClick={(e) => {
                                        let b = industryModifiers;
                                        let x = new IndustryEntry();
                                        b.push(x);
                                        setIndustryMods(b);
                                        forceUpdate();
                                    }}>Add</Button>
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
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