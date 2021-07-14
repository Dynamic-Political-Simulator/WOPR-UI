import { useEffect, useState } from "react";
import { Jumbotron, Button, Input, Label } from "reactstrap";

class SaveEntry {
    name: string = "";
    ingameDate: string = "";
}

function GameManager() {
    const [loading, setLoading] = useState(true);
    const [saves, setSaves] = useState<SaveEntry[]>();
    const [dataFile, setDataFile] = useState<Blob>();

    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "saves/list-saves", requestInit)
            .then((response) => response.json())
            .then((response) => {
                setSaves(response);
                setLoading(false);
            });
    }, []);

    function readFileDataAsBase64(path: Blob) {
        const file = path;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                let encoded = (event.target!.result! as string).replace(/^data:(.*,)?/, ''); // This is disgusting but TS does not know that this will be a string
                resolve(encoded);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(file);
        });
    }

    function parseSave(name: string) {
        setProcessing(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "saves/parse-save?name=" + name, requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => setProcessing(false));
    }

    function uploadPop() {
        if (typeof dataFile == undefined) return;
        setProcessing(true);
        let save = dataFile as Blob;
        readFileDataAsBase64(save).then(result => {
            var body = {
                saveFile: result
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

            fetch(process.env.BASE_URL + "saves/upload-pop", requestInit)
                .catch(() => setError("Something went wrong, try again."))
                .then(() => setProcessing(false));
        });
    }

    function uploadEmpire() {
        if (typeof dataFile == undefined) return;
        setProcessing(true);
        let save = dataFile as Blob;
        readFileDataAsBase64(save).then(result => {
            var body = {
                saveFile: result
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

            fetch(process.env.BASE_URL + "saves/upload-empire", requestInit)
                .catch(() => setError("Something went wrong, try again."))
                .then(() => setProcessing(false));
        });
    }

    function parseData() {
        setProcessing(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "saves/parse-data", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => setProcessing(false));
    }

    function runCalc() {
        setProcessing(true);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "saves/calculate", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => setProcessing(false));
    }

    if (loading) {
        return (
            <div>
                <Jumbotron>
                    <h1>Loading...</h1>
                </Jumbotron>
            </div>
        )
    } else {
        return (
            <div>
                <Jumbotron>
                    <h1>Game Manager</h1>
                    <p>1:</p>
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <th>
                                    In-game Date
                                </th>
                                <th>

                                </th>
                            </tr>
                            {saves?.map(x =>
                                <tr>
                                    <td>
                                        {x.name}
                                    </td>
                                    <td>
                                        {x.ingameDate}
                                    </td>
                                    <td>
                                        <Button disabled={processing} onClick={e => parseSave(x.name)}>
                                            Parse
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <br />
                    <hr />
                    <p>2:</p>
                    <Label>Data File: </Label>
                    <Input type="file" accept=".xml" onChange={(e) => { if (e.target.files !== null) setDataFile(e.target.files![0]) }} />
                    <Button disabled={processing} onClick={uploadPop}>Upload as Pop Data</Button>
                    <Button disabled={processing} onClick={uploadEmpire}>Upload as Empire Data</Button>
                    <br />
                    <hr />
                    <p>3:</p>
                    <Button disabled={processing} onClick={parseData}>
                        Parse Data
                    </Button>
                    <br />
                    <hr />
                    <p>4:</p>
                    <Button disabled={processing} onClick={runCalc}>
                        Run Calculations
                    </Button>
                </Jumbotron>
            </div>
        )
    }
}

export default GameManager;