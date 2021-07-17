import { render } from '@testing-library/react';
import { Console, group } from 'console';
import queryString from 'query-string';
import React, { useEffect, useState, useReducer, useRef, Ref } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Container, Input, Jumbotron, Label, ListGroup } from 'reactstrap';
import pattern1 from './Patterns/1.png';
import pattern2 from './Patterns/2.png';
import pattern3 from './Patterns/3.png';
import pattern4 from './Patterns/4.png';
import pattern5 from './Patterns/5.png';
import pattern6 from './Patterns/6.png';
import pattern7 from './Patterns/7.png';
import pattern8 from './Patterns/8.png';
import pattern9 from './Patterns/9.png';
import pattern10 from './Patterns/10.png';
import pattern11 from './Patterns/11.png';
import pattern12 from './Patterns/12.png';
import pattern13 from './Patterns/13.png';
import pattern14 from './Patterns/14.png';
import pattern15 from './Patterns/15.png';
import pattern16 from './Patterns/16.png';
import { useCookies } from 'react-cookie';

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
            res.modifier![k] = parseFloat(v);
        });
        res.size = parseFloat(this.Size);
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
        res.modifier = parseFloat(this.Modifier);
        return res;
    }
}

class IndustryEntrySend {
    name: string = "";
    gdp: number = 0;
    modifier: number = 1;

    static toLocal(og: IndustryEntrySend): IndustryEntry {
        let res = new IndustryEntry();
        res.Name = og.name;
        res.GDP = og.gdp;
        res.Modifier = og.modifier?.toString();
        return res;
    }
}

class AlignmentPopularityEntry {
    name: string = "";
    popularity: number = 0;
}

class AlignModEdit {
    name: string = "";
    mod: string = "";

    static toSend(og: AlignModEdit) {
        let res = new AlignModSend();
        res.name = og.name;
        res.mod = parseFloat(og.mod);
        return res;
    }
}

class AlignModSend {
    name: string = "";
    mod: number = 0;

    static toEdit(og: AlignModSend) {
        let res = new AlignModEdit();
        res.name = og.name;
        res.mod = og.mod.toString();
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
    popularityEntries: AlignmentPopularityEntry[] = [];
    alignmentModifiers: AlignModSend[] = [];
}

enum STATE {
    Loading,
    Loaded,
    Errored
}

export function Planet() {
    const history = useHistory();
    const location = useLocation();
    const [cookies, setCookie] = useCookies();
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState(STATE.Loading);
    const [expanded, setExpanded] = useState(false);
    const [coloured, setColoured] = useState("");
    const [saving, setSaving] = useState(false);

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
    const [alignmentPopularity, setAlignmentPopularity] = useState<AlignmentPopularityEntry[]>([]);
    const [alignmentModifiers, setAlignmentMods] = useState<AlignModEdit[]>([]);

    const name: string = queryString.parse(location.search).name as string;

    const industryGDPChart = useRef<HTMLCanvasElement>(null);
    const popsimAlignChart = useRef<HTMLCanvasElement>(null);

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

    function waitFor(conditionFunction: Function) {

        function poll(resolve: Function) {
            if (conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 400);
        }

        return new Promise<void>((resolve, reject) => poll(resolve));
    }

    function colorImage(dest: HTMLCanvasElement, color: string) {
        let ctx = dest.getContext("2d")!;
        ctx.fillStyle = color;
        //ctx.globalCompositeOperation = "color";
        ctx.fillRect(0, 0, dest.width, dest.height);
        ctx.globalCompositeOperation = "source-over";
        return dest;
    }

    function maskImage(dest: HTMLCanvasElement, source: CanvasImageSource) {
        let ctx = dest.getContext("2d")!;
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(source, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        return dest;
    }

    function doIndustryRender() {
        if (state != STATE.Loaded) return;
        if (industryGDPChart.current) {
            const canvas = industryGDPChart.current;
            const context = canvas.getContext('2d');

            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                // 10 values max
                let colours: CanvasPattern[] = [];

                let files: string[] = [
                    pattern1,
                    pattern2,
                    pattern3,
                    pattern4,
                    pattern5,
                    pattern6,
                    pattern7,
                    pattern8,
                    pattern9,
                    pattern10,
                    pattern11,
                    pattern12,
                    pattern13,
                    pattern14,
                    pattern15,
                    pattern16
                ];

                files.forEach((x) => {
                    let img = new Image();
                    img.src = x;
                    img.onload = () => colours.push(context.createPattern(img, "repeat")!);
                });

                waitFor(() => colours.length == files.length).then(() => {
                    let yp = canvas.height / 2;
                    let radius = canvas.height / 2;
                    let xp = radius;

                    let startingPoint = 0;

                    let industryTable = industryModifiers?.slice();
                    let industryChartTable = industryTable.splice(0, colours.length - 1);
                    if (industryTable.length > 0) {
                        let others = new IndustryEntry();
                        others.Name = "other";
                        others.GDP = industryTable.map(x => x.GDP).reduce((a, b) => a + b)
                        industryChartTable.push(others);
                    }

                    let total = 0;
                    if (industryChartTable.length > 0) total = industryChartTable.map(x => x.GDP).reduce((a, b) => a + b);

                    console.table(industryChartTable);
                    console.table(industryModifiers);

                    const column = 8;

                    for (let i = 0; i < industryChartTable.length; i++) {
                        let percent = (industryChartTable[i].GDP / total) * 100;

                        let endPoint = startingPoint + (2 / 100 * percent);

                        context.beginPath();

                        context.fillStyle = colours[i];
                        context.strokeStyle = "#00ff00";
                        context.moveTo(xp, yp);
                        context.arc(xp, yp, radius, startingPoint * Math.PI, endPoint * Math.PI);
                        context.fill();
                        context.stroke();

                        startingPoint = endPoint;


                        let offset = 2.2 * radius + 1.5 * radius * Math.floor((i / column));
                        context.rect(offset, 0.1 * canvas.height * (i % column), 0.09 * canvas.height, 0.09 * canvas.height);
                        context.fill();
                        context.rect(offset, 0.1 * canvas.height * (i % column), 0.09 * canvas.height, 0.09 * canvas.height);
                        context.stroke();
                        context.fillStyle = "#00ff00";
                        context.textAlign = "left";
                        context.font = "12px monospace";
                        context.textBaseline = "bottom";
                        context.fillText(beautifyOutputEntry(industryChartTable[i].Name) + " (" + percent.toFixed(2) + "%)", offset + 0.1 * canvas.height, ((i % column + 1) * 0.1 * canvas.height - 0.01 * canvas.height));
                    }

                    const newClr = getComputedStyle(document.documentElement).getPropertyValue("--colour");
                    setColoured(newClr);
                    let fuck = new Image();
                    fuck.src = canvas.toDataURL();
                    fuck.onload = () => {
                        colorImage(canvas, newClr);
                        maskImage(canvas, fuck);
                    }
                });
            }
        }
    }

    function doPopsimRender() {
        if (state != STATE.Loaded) return;
        if (popsimAlignChart.current) {
            const canvas = popsimAlignChart.current;
            const context = canvas.getContext('2d');

            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                // 10 values max
                let colours: CanvasPattern[] = [];

                let files: string[] = [
                    pattern1,
                    pattern2,
                    pattern3,
                    pattern4,
                    pattern5,
                    pattern6,
                    pattern7,
                    pattern8,
                    pattern9,
                    pattern10,
                    pattern11,
                    pattern12,
                    pattern13,
                    pattern14,
                    pattern15,
                    pattern16
                ];

                files.forEach((x) => {
                    let img = new Image();
                    img.src = x;
                    img.onload = () => colours.push(context.createPattern(img, "repeat")!);
                });

                waitFor(() => colours.length == files.length).then(() => {
                    let yp = canvas.height / 2;
                    let radius = canvas.height / 2;
                    let xp = radius;

                    let startingPoint = 0;

                    let popularityTable = alignmentPopularity?.sort((a, b) => a.popularity - b.popularity).reverse().slice();
                    let popularityChartTable = popularityTable.splice(0, colours.length - 1);
                    if (popularityTable.length > 0) {
                        let others = new AlignmentPopularityEntry();
                        others.name = "Other";
                        others.popularity = popularityTable.map(x => x.popularity).reduce((a, b) => a + b)
                        popularityChartTable.push(others);
                    }

                    let total = 0;
                    if (popularityChartTable.length > 0) total = popularityChartTable.map(x => x.popularity).reduce((a, b) => a + b);

                    const column = 8;

                    for (let i = 0; i < popularityChartTable.length; i++) {
                        let percent = (popularityChartTable[i].popularity / total) * 100;

                        let endPoint = startingPoint + (2 / 100 * percent);

                        context.beginPath();

                        context.fillStyle = colours[i];
                        context.strokeStyle = "#00ff00";
                        context.moveTo(xp, yp);
                        context.arc(xp, yp, radius, startingPoint * Math.PI, endPoint * Math.PI);
                        context.fill();
                        context.stroke();

                        startingPoint = endPoint;


                        let offset = 2.2 * radius + 1.5 * radius * Math.floor((i / column));
                        context.rect(offset, 0.1 * canvas.height * (i % column), 0.09 * canvas.height, 0.09 * canvas.height);
                        context.fill();
                        context.rect(offset, 0.1 * canvas.height * (i % column), 0.09 * canvas.height, 0.09 * canvas.height);
                        context.stroke();
                        context.fillStyle = "#00ff00";
                        context.textAlign = "left";
                        context.font = "12px monospace";
                        context.textBaseline = "bottom";
                        context.fillText(beautifyOutputEntry(popularityChartTable[i].name) + " (" + percent.toFixed(2) + "%)", offset + 0.1 * canvas.height, ((i % column + 1) * 0.1 * canvas.height - 0.01 * canvas.height));
                    }

                    const newClr = getComputedStyle(document.documentElement).getPropertyValue("--colour");
                    setColoured(newClr);
                    let fuck = new Image();
                    fuck.src = canvas.toDataURL();
                    fuck.onload = () => {
                        colorImage(canvas, newClr);
                        maskImage(canvas, fuck);
                    }
                });
            }
        }
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

        fetch(process.env.REACT_APP_BASE_URL + "clique/get-alignments", requestInit)
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

                fetch(process.env.REACT_APP_BASE_URL + "map/get-planet?name=" + name, requestInit)
                    .then((response) => response.json())
                    .then((response) => {
                        try {
                            let planet: PlanetData = response;
                            setPopulation(planet.population);
                            setPlanetName(planet.name);

                            setAlignments(planet.officeAlignments);

                            setGroups(planet.groupEntries.map((x: GroupEntrySend) => GroupEntrySend.toLocal(x, alignmento[0])));
                            setIndustryMods(planet.industryEntries.map((x: IndustryEntrySend) => IndustryEntrySend.toLocal(x)).sort((a, b) => a.GDP - b.GDP).reverse());
                            setPops(planet.species);
                            setAlignmentPopularity(planet.popularityEntries);
                            setAlignmentMods(planet.alignmentModifiers.map(x => AlignModSend.toEdit(x)));
                            setState(STATE.Loaded);
                        } catch {
                            setState(STATE.Errored);
                        }
                    });
            });
    }, []);

    useEffect(() => {
        doIndustryRender();
        doPopsimRender();
    }, [state]);

    useEffect(() => {
        if (coloured !== getComputedStyle(document.documentElement).getPropertyValue("--colour") && coloured !== "") {
            doIndustryRender();
            doPopsimRender();
        }
    });

    function submitEdit() {
        if (groups.map(x => parseFloat(x.Size)).reduce((a, b) => a + b) !== 100) {
            let check = window.confirm("Planet Group sizes do not add up to 100%. This will result in problems! Are you sure you want to continue?");
            if (!check) return;
        }
        setSaving(true);
        setEdit(false);

        let planet = new PlanetData();
        planet.population = population;
        planet.name = planetName;

        planet.officeAlignments = alignments;

        planet.groupEntries = groups.map(x => x.toSend());
        planet.industryEntries = industryModifiers.map(x => x.toSend());
        planet.alignmentModifiers = alignmentModifiers.map(x => AlignModEdit.toSend(x));

        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(planet)
        };

        fetch(process.env.REACT_APP_BASE_URL + "map/edit-planet", requestInit)
            .then((response) => {
                setSaving(false);

                var requestInit: RequestInit = {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                fetch(process.env.REACT_APP_BASE_URL + "map/get-planet?name=" + name, requestInit)
                    .then((response) => response.json())
                    .then((response) => {
                        try {
                            let planet: PlanetData = response;
                            setPopulation(planet.population);
                            setPlanetName(planet.name);

                            setAlignments(planet.officeAlignments);

                            setGroups(planet.groupEntries.map((x: GroupEntrySend) => GroupEntrySend.toLocal(x, alignmentData[0])));
                            setIndustryMods(planet.industryEntries.map((x: IndustryEntrySend) => IndustryEntrySend.toLocal(x)));
                            setPops(planet.species);
                            setAlignmentPopularity(planet.popularityEntries);
                            setAlignmentMods(planet.alignmentModifiers.map(x => AlignModSend.toEdit(x)));
                            setState(STATE.Loaded);
                            doIndustryRender();
                            doPopsimRender();
                            forceUpdate();
                        } catch {
                            setState(STATE.Errored);
                        }
                    });
            });
    }

    function makeNewAlignEntry(align: string) {
        let x = new AlignModEdit();
        x.name = align;
        x.mod = "0";
        alignmentModifiers.push(x);
        return x.mod;
    }

    if (state == STATE.Loading) {
        return (
            <div className="planetScreen">
                <h1><b>{name}</b></h1>
                <hr style={{
                    borderTop: "2px solid var(--colour)"
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
                    borderTop: "2px solid var(--colour)"
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
                <h1><b>{planetName}</b><span style={{ color: "blue" }}>{saving ? "(Saving...)" : ""}</span></h1>
                <hr style={{
                    borderTop: "2px solid var(--colour)"
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
                                Members
                            </th>
                        </tr>
                        {
                            groups.map((g) => (<tr>
                                <td>
                                    {g.Name}
                                </td>
                                <td>
                                    {intToString((parseFloat(g.Size) / 100) * population)} ({g.Size}%)
                                </td>
                            </tr>))}
                    </tbody>
                </table>
                <br />
                <canvas
                    height={Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.35}
                    width={Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.7}
                    ref={popsimAlignChart} />
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
                                    {beautifyOutputEntry(spe.Name)}
                                </td>
                                <td>
                                    {intToString(spe.GDP)}
                                </td>
                                <td>
                                    {((spe.GDP / gdpSum) * 100).toFixed(2)}%
                                </td>
                            </tr>
                        )).slice(0, !expanded ? 10 : undefined)}
                    </tbody>
                </table>
                <Button onClick={() => setExpanded(!expanded)}>{!expanded ? "Expand" : "Collapse"}</Button>
                <br /><br />
                <canvas
                    height={Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.35}
                    width={Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.7}
                    ref={industryGDPChart} />
                <br /><br />
                <Button onClick={() => history.push("/map")}>Back</Button>&nbsp;<Button onClick={() => setEdit(true)} hidden={cookies["isAdmin"] === "false"}>Edit</Button>
            </div>
        )
    } else {
        return (
            <div className="planetScreen">
                <h1><b>{planetName}</b> <span style={{ color: "red" }}>(Edit Mode)</span></h1>
                <hr style={{
                    borderTop: "2px solid var(--colour)"
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
                                Percentage of Population
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
                                        className="percentInputThing"
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
                                        value={g.CurrMod != undefined ? g.Modifier?.has(g.CurrMod) ? g.Modifier?.get(g.CurrMod) : 1 : "undefined"}
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
                <table className="planetTable">
                    <tbody>
                        <tr>
                            <th>
                                Alignment
                            </th>
                            <th>
                                Modifier
                            </th>
                        </tr>
                        {alignmentData.map((align) =>
                            <tr>
                                <td>{align}</td>
                                <td><Input type="text"
                                    value={alignmentModifiers.find(x => x.name == align) !== undefined ? alignmentModifiers.find(x => x.name == align)?.mod : makeNewAlignEntry(align)}
                                    onChange={(e) => {
                                        let a = alignmentModifiers;
                                        let x = alignmentModifiers.findIndex(x => x.name == align)!;
                                        a[x].mod = e.target.value;
                                        setAlignmentMods(a);
                                        forceUpdate();
                                    }}
                                /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                            industryModifiers.map((m) => (<tr>
                                <td>
                                    {m.Name}
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
                }}>Save</Button>
            </div>
        )
    }
}