import { type } from "os";
import React, { useState } from "react";
import { Input, Jumbotron, Label, Button } from "reactstrap";

function ClockSetter() {
    const [time, setTime] = useState<number>(3);

    const [error, setError] = useState<string | undefined>(undefined);

    function parseOption(t?: number) {
        switch (t) {
            case 1:
                return "<b>1 minute to midnight</b>";
            case 2:
                return "<b>2 minutes to midnight</b>";
            case 3:
                return "<b>5 minutes to midnight</b>";
            case 4:
                return "<b>10 minutes to midnight</b>";
            case 5:
                return "<b>15 minutes to midnight</b>";
            default:
                return "<b>Undefined.</b>"
        }
    }

    function handleClick() {
        if (typeof time == undefined) return;
        let res: number = 900;
        switch (time) {
            case 1:
                res = 60;
                break;
            case 2:
                res = 120;
                break;
            case 3:
                res = 300;
                break;
            case 4:
                res = 600;
                break;
            case 5:
                res = 900;
                break;
        }

        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newTime: res.toString() })
        };

        fetch("https://localhost:44394/api/clock/time", requestInit)
            .catch(() => setError("Something went wrong, try again."))
            .then(() => console.log("Success!"));
    }

    return (
        <div>
            <Jumbotron>
                <h1>Set the Time to Midnight</h1>


                <Label>Time to Midnight: </Label>
                <Input name="time" type="range" min={1} max={5} step={1} onChange={(e) => { if (e.target!.value !== null) setTime(parseInt(e.target!.value)) }} />
                <Label>Currently Selected: <span dangerouslySetInnerHTML={{ __html: parseOption(time) }}></span></Label>
                <br />
                <Button color="secondary" onClick={handleClick}>
                    Set
                </Button>
            </Jumbotron>
        </div>
    )
}

export default ClockSetter;