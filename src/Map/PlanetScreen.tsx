import { render } from '@testing-library/react';
import { Console, group } from 'console';
import React, { useEffect, useState, useReducer } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';

class PopEntry {
    species: string = "";
    amount: string = "0";
}

class GroupEntry {
    name: string = "";
    alignment: string = "";
    modifier: string = "";
}

class IndustryModifier {
    name: string = "";
    value: string = "";
}

export function Planet() {
    const history = useHistory();
    const [edit, setEdit] = useState(false);
    const [species, setSpecies] = useState<string>();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

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
    const [groups, setGroups] = useState<GroupEntry[]>([
        {
            name: "A",
            alignment: "Conservative",
            modifier: "70"
        },
        {
            name: "B",
            alignment: "Conservative",
            modifier: "30"
        }
    ]);
    const [industries, setIndustries] = useState<string[]>([
        "Cum Factory",
        "Korn"
    ]);
    const [industryModifiers, setIndustryMods] = useState<IndustryModifier[]>([
        {
            name: "A",
            value: "70"
        },
        {
            name: "B",
            value: "30"
        }
    ]);

    const [data, setData] = useState<string[]>();
    const [alignmentData, setAlignmentData] = useState<string[]>([
        "Conservative",
        "Reformist",
        "Ultrafederalist",
        "Hardliner"
    ]);

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


    }, []);

    if (!edit) {
        return (
            <div className="planetScreen">
                <h1><b>Planet Name</b></h1>
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
                                Alignment
                    </th>
                        </tr>
                        {
                            groups.map((g) => (<tr>
                                <td>
                                    {g.name}
                                </td>
                                <td>
                                    {g.alignment}
                                </td>
                            </tr>))}
                    </tbody>
                </table>
                <br />
                <b>Industries:</b> {industries.map((x) => x + (industries.indexOf(x) == industries.length - 1 ? "" : ", "))}
                <br /><br />
                <Button onClick={() => history.push("/map")}>Back</Button>&nbsp;<Button onClick={() => setEdit(true)}>Edit</Button>
            </div>
        )
    } else {
        return (
            <div className="planetScreen">
                <h1><b>Planet Name</b> <span style={{ color: "red" }}>(Edit Mode)</span></h1>
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
                                        value={g.name}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].name = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input type="select" value={g.alignment} onChange={(e) => {
                                        let b = groups;
                                        b[b.indexOf(g)].alignment = e.target.value;
                                        setGroups(b);
                                        forceUpdate(); // react sucks balls
                                    }}>
                                        {alignmentData?.map((a) => (<option>{a}</option>))}
                                    </Input>
                                </td>
                                <td>
                                    <Input
                                        type="text"
                                        value={g.modifier}
                                        onChange={(e) => {
                                            let b = groups;
                                            b[b.indexOf(g)].modifier = e.target.value;
                                            setGroups(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
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
                <b>Industries:</b> {industries.map((x) => x + (industries.indexOf(x) == industries.length - 1 ? "" : ", "))}
                <br /><br />
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Modifier Name
                    </th>
                            <th>
                                Value
                    </th>
                            <th></th>
                        </tr>
                        {
                            industryModifiers.map((m) => (<tr>
                                <td>
                                    <Input
                                        type="text"
                                        value={m.name}
                                        onChange={(e) => {
                                            let b = industryModifiers;
                                            b[b.indexOf(m)].name = e.target.value;
                                            setIndustryMods(b);
                                            forceUpdate(); // react sucks balls
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="text"
                                        value={m.value}
                                        onChange={(e) => {
                                            let b = industryModifiers;
                                            b[b.indexOf(m)].value = e.target.value;
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
                                        let x = new IndustryModifier();
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
                    setEdit(false);
                }}>Save</Button>
            </div>
        )
    }
}