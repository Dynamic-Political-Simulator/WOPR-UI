import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import "./Options.css";

export function Options() {
    const history = useHistory();
    const [cookies, setCookie] = useCookies();


    const presets = [
        /*
            Format:
            [
                Name,
                Foreground,
                Background
            ]
        */
        [
            "Default",
            "#00FF00",
            "#28a745"
        ],
        [
            "Apple IIc",
            "#66FF66",
            "#47b247"
        ],
        [
            "TNO Cyan",
            "#00ffff",
            "#00b2b2"
        ],
        [
            "FO:NV Amber",
            "#FFB642",
            "#CC9134"
        ],
        // KEEP CUSTOM LAST PLEASE
        [
            "Custom",
            "It does not matter",
            "What is in these 2 strings"
        ]
    ];
    const [currPreset, setCurrPreset] = useState<number>();

    useEffect(() => {
        let index = presets.map(x => x[0]).indexOf(cookies["presetName"]);
        if (index === undefined) index = 0;
        setCurrPreset(index);
    }, []);

    function further() {
        if (currPreset === undefined) return;
        if (currPreset === presets.length - 1) {
            setCurrPreset(0);
            return;
        }
        setCurrPreset((currPreset + 1) % (presets.length - 1));
        //update();
    }

    function backward() {
        if (currPreset === undefined) return;
        setCurrPreset(currPreset - 1 >= 0 ? currPreset - 1 : presets.length - 2);
        //update();
    }

    function update() {
        if (currPreset === undefined) return;
        setCookie("presetName", presets[currPreset][0]);
        setCookie("fg", presets[currPreset][1]);
        setCookie("bg", presets[currPreset][2]);
        let r: HTMLElement = document.querySelector(':root')!;
        r.style.setProperty("--colour", presets[currPreset][1]);
        r.style.setProperty("--darkColour", presets[currPreset][2]);
    }

    useEffect(() => {
        if (currPreset === presets.length - 1) return;
        update();
    }, [currPreset]);

    function setFG() {
        if (currPreset !== presets.length - 1) setCurrPreset(presets.length - 1);
        let colour = (document.getElementById("fgPicker") as HTMLInputElement).value;
        setCookie("presetName", presets[presets.length - 1][0]);
        setCookie("fg", colour);
        let r: HTMLElement = document.querySelector(':root')!;
        r.style.setProperty("--colour", colour);
    }

    function setBG() {
        if (currPreset !== presets.length - 1) setCurrPreset(presets.length - 1);
        let colour = (document.getElementById("bgPicker") as HTMLInputElement).value;
        setCookie("presetName", presets[presets.length - 1][0]);
        setCookie("bg", colour);
        let r: HTMLElement = document.querySelector(':root')!;
        r.style.setProperty("--darkColour", colour);
    }

    return (
        <div className="options">
            <div className="inside">
                <div className="optTitle">Options</div>
                <button className="optExit" onClick={() => history.push("")}>X</button>
                <span className="presetChooser">
                    <button className="presetNav" onClick={backward}>&lt;</button>
                    <span className="presetDisp">{presets[currPreset === undefined ? 0 : currPreset][0]}</span>
                    <button className="presetNav" onClick={further}>&gt;</button>
                </span>
                <br />
                <br />
                <span className="foregroundText">This is how foreground text looks like.</span>
                <br />
                <span className="brightText">This is how text on a bright background looks like.</span>
                <br />
                <input type="color" id="fgPicker" onChange={() => setFG()} value={cookies["fg"]} />
                <br />
                <br />
                <span className="backgroundText">This is how background text looks like.</span>
                <br />
                <span className="darkText">This is how text on a dark background looks like.</span>
                <br />
                <input type="color" id="bgPicker" onChange={() => setBG()} value={cookies["bg"]} />
                <br />
                <p style={{ color: "red" }} hidden={!(cookies["fg"] === "#000000" && cookies["bg"] === "#000000")}>You did this to yourself.</p>
            </div>
        </div>
    )
}