import { type } from "os";
import React, { useState } from "react";
import { Input, Jumbotron, Label, Button } from "reactstrap";

function ModifyGlobalGroup() {
    const [time, setTime] = useState<number>(3);

    const [error, setError] = useState<string | undefined>(undefined);

    return (
        <div>
            <Jumbotron>
                <h1>Modify Group</h1>


                <Label>Time to Midnight: </Label>
                <Input name="time" type="range" min={1} max={5} step={1} onChange={(e) => { if (e.target!.value !== null) setTime(parseInt(e.target!.value)) }} />
                <Label>Currently Selected: <span></span></Label>
                <br />
                <Button color="secondary">
                    Update
                </Button>
            </Jumbotron>
        </div>
    )
}

export default ModifyGroup;