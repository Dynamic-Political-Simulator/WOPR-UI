import React, { useEffect, useState } from 'react';
import "./Options.css";

export function Options() {
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
            "Apple //c",
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
        [
            "Custom",
            "It does not matter",
            "What is in these 2 strings"
        ]
    ]

    return (
        <div className="options">
            <div className="windowBar">
                <span id="title" className="title">Options    </span>
                <span className="buttonRow">
                    <button type="button" className="minimise">_</button>
                    <button type="button" className="popOut">□</button>
                    <button type="button" className="close">X</button>
                </span>
            </div>
            <div className="container">
            </div>
        </div>
    )
}