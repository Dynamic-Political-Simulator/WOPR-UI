import { type } from "os";
import React, { useState } from "react";
import { Input, Jumbotron, Label, Button } from "reactstrap";

function SaveUploader() {
    const [savePath, setPath] = useState<Blob>();

    const [error, setError] = useState<string | undefined>(undefined);

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

    function handleClick() {
        if (typeof savePath == undefined) return;
        let save = savePath as Blob;
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

            fetch("https://localhost:44394/api/saves/upload-save", requestInit)
                .catch(() => setError("Something went wrong, try again."))
                .then(() => console.log("Success!"));
        });
    }

    return (
        <div>
            <Jumbotron>
                <h1>Ye Olde Save Uploader</h1>


                <Label>Save File: </Label>
                <Input name="savePath" type="file" accept=".sav" onChange={(e) => { if (e.target.files !== null) setPath(e.target.files![0]) }} />

                <Button color="secondary" onClick={handleClick}>
                    Upload
                </Button>
            </Jumbotron>
        </div>
    )
}

export default SaveUploader;