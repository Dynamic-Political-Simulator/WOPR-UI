import React, { ChangeEvent, useEffect, useState } from "react";
import L, { LatLngBoundsExpression, marker } from "leaflet";
import "./Map.css";
import { SVGIcon } from "./SVGIcon/SVGIcon";
import SVGIconOptions from "./SVGIcon/SVGIconOptions";
import planetMarker from "./planetMarker.svg";
import { Input, Button } from "reactstrap";
import { render } from "@testing-library/react";

export const baseX = 40;
export const baseY = 40;

export class PlanetEntry {
    name: string = "";
    description: string = "";
    colour: string = "";
    location: number[] = [];
}

function MapEdit() {
    let map: L.Map;
    let image;
    const [colour, setColour] = useState("#FFFFFF");
    const [pos, setPos] = useState(new L.LatLng(500, 500));
    const [id, setId] = useState<string>();
    const [processing, setProcessing] = useState<boolean>(false);

    function getPlanets(map: L.Map) {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET"
        };

        fetch(process.env.BASE_URL + "map/get", requestInit)
            .then((response) => response.json())
            .then((response) => {
                let entries = response as PlanetEntry[];
                let markers: L.Marker[] = [];
                let currentZoom = map.getZoom();

                //Update X and Y based on zoom level
                let x = baseX / (3 - currentZoom); //Update x
                let y = baseY / (3 - currentZoom); //Update Y
                entries.forEach(element => {
                    console.log(element);
                    let marker = L.marker([element.location[0], element.location[1]], {
                        icon: new SVGIcon({
                            iconAnchor: new L.Point(x / 2, y / 2),
                            svgLink: "../images/planetMarker.svg",
                            color: element.colour,
                            interactable: true,
                            iconSize: new L.Point(x, y)
                        }),
                        draggable: false
                    });
                    marker.bindTooltip(element.name, {
                        offset: [x / 2, 0]
                    });
                    markers.push(marker);
                    marker.addTo(map);
                });

                map.on('zoomend', function () {
                    markers.forEach(marker => {
                        let currentZoom = map.getZoom();

                        //Update X and Y based on zoom level
                        let x = baseX / (3 - currentZoom); //Update x
                        let y = baseY / (3 - currentZoom); //Update Y
                        var icon = new SVGIcon({
                            iconAnchor: new L.Point(x / 2, y / 2),
                            svgLink: "../images/planetMarker.svg",
                            color: (marker.getIcon().options as SVGIconOptions).color,
                            interactable: true,
                            iconSize: new L.Point(x, y)
                        });
                        marker.getTooltip()!.options.offset = [x / 2, 0];
                        marker.setIcon(icon);
                    });
                });
            });
    }

    useEffect(() => {
        map = L.map('galacticMap', {
            crs: L.CRS.Simple,
            maxZoom: 2,
            zoom: 0,
            minZoom: 0,
            center: [500, 500],
            maxBounds: L.latLngBounds(
                L.latLng(0, 0),
                L.latLng(1000, 1000)
            )
        });

        let marker = L.marker([500, 500], {
            icon: new SVGIcon({
                iconAnchor: new L.Point(baseX / 6, baseY / 6),
                svgLink: "../images/planetMarker.svg",
                color: colour,
                interactable: true,
                iconSize: new L.Point(baseX / 3, baseY / 3)
            }),
            draggable: true
        });

        marker.on('move', (e) => {
            setPos((e.target as L.Marker).getLatLng());
        });
        let bounds: LatLngBoundsExpression = [[0, 0], [1000, 1000]];
        image = L.imageOverlay("../images/galacticmapnotext.png", bounds).addTo(map);
        //L.svgOverlay(planetMarker, [[490, 490], [510, 510]]).addTo(map);

        map.on('zoomend', function () {
            var currentZoom = map.getZoom();

            //Update X and Y based on zoom level
            var x = baseX / (3 - currentZoom); //Update x
            var y = baseY / (3 - currentZoom); //Update Y
            var icon = new SVGIcon({
                iconAnchor: new L.Point(x / 2, y / 2),
                svgLink: "../images/planetMarker.svg",
                color: (marker.getIcon().options as SVGIconOptions).color,
                interactable: true,
                iconSize: new L.Point(x, y)
            });
            marker.setIcon(icon);
        });

        marker.addTo(map);

        getPlanets(map);
    }, []);

    function handleColourChange(e: ChangeEvent<HTMLInputElement>) {
        setColour((document.getElementById("colourField") as HTMLInputElement).value);
    }

    function submit() {
        var body = {
            planetName: id,
            location: [pos.lat, pos.lng],
            colour: colour
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

        setProcessing(true);

        fetch(process.env.BASE_URL + "map/add", requestInit)
            .then((response) => response.json())
            .then((response) => {
                alert(response.body);
                setProcessing(false);
            });
    }

    return (
        <div>
            <div id="galacticMap"></div>
            <form id="mapEditForm">
                <span>Colour:</span><input type="color" onChange={e => handleColourChange(e)} id="colourField" /><br />
                <span>Planet Name:</span><input type="text" id="idField" onChange={e => setId(e.target.value)} /><br />
                <Button onClick={submit} disabled={processing}>Submit</Button>
            </form>
        </div>
    )
}

export default MapEdit;