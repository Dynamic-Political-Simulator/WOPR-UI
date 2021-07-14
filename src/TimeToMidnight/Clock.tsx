import React, { useEffect, useState } from 'react';
import "./midnightClock.css";

function secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

function getClass(d?: number) {
    switch (d) {
        case 60:
            return "clock60";
        case 120:
            return "clock120";
        case 300:
            return "clock300";
        case 600:
            return "clock600";
        case 900:
            return "clock900";
        case undefined:
            return "clockNull"; // Stall for time
        default:
            console.error("No image defined for time " + d + ", defaulting to clock900.");
            return "clock900";
    }
}

export function Clock() {
    const [data, setData] = useState<number>();

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "clock/time", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }, []);

    return (
        <div className={getClass(data)} />
    )
}