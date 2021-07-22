import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import GaugeChart from 'react-gauge-chart';

class GovEntry {
    name: string = "";
    popularity: number = 0.5;
    alignment: string = "";
}

export function GovernmentPopularity() {
    const [data, setData] = useState<number>();
    const [cookies, setCookie] = useCookies();

    const [branches, setBranches] = useState<GovEntry[]>([]);

    let fgColour = cookies["fg"];
    let bgColour = cookies["bg"];


    useEffect(() => {
        //     const br: GovEntry[] = [
        //         {
        //             name: "Cabinet",
        //             popularity: 0.33,
        //             alignment: "Reformist"
        //         },
        //         {
        //             name: "Parliament",
        //             popularity: 0.22,
        //             alignment: "Conservative"
        //         },
        //         {
        //             name: "Party Rock",
        //             popularity: 1,
        //             alignment: "Party Rock"
        //         }
        //     ];
        //     setBranches(br);
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.REACT_APP_BASE_URL + "popsim/get-gov", requestInit)
            .then((response) => response.json())
            .then((response) => setBranches(response));
    }, []);

    useEffect(() => {
        const charts = document.getElementsByClassName("needleChart");
        for (let x = 0; x < charts.length; x++) {
            let el = charts.item(x);
            let svgEl = el?.firstChild as SVGElement;
            let needle = svgEl.getElementsByClassName("needle").item(0) as SVGGElement;
            for (let y = 0; y < needle.children.length; y++) {
                let child = needle.children.item(y);
                child?.setAttribute("stroke", child?.getAttribute("fill")!);
                child?.removeAttribute("fill");
            }
        }
    });

    const chartStyle = {
        width: "25vw"
    };

    if (branches.length === 0) {
        return (
            <div className="planetScreen">
                <h1>Government Popularity</h1>
                <hr style={{
                    borderTop: "1px solid var(--colour)"
                }} />
                Loading...
            </div>
        );
    }

    return (
        <div className="planetScreen">
            <h1>Government Popularity</h1>
            {branches.map(br => (
                <div id={br.name + "DIV"}>
                    <hr style={{
                        borderTop: "1px solid var(--colour)"
                    }} />
                    <h2>{br.name}</h2>
                    Perceived Alignment:&nbsp;<b>{br.alignment}</b><br />
                    Support:<br />
                    <GaugeChart id={br.name}
                        style={chartStyle}
                        colors={Array(10).fill(bgColour)}
                        nrOfLevels={10}
                        needleColor={bgColour}
                        needleBaseColor={bgColour}
                        textColor={fgColour}
                        cornerRadius={0}
                        percent={br.popularity}
                        formatTextValue={x => x + "%"}
                        className="needleChart" />
                </div>
            ))}
        </div>
    );
}