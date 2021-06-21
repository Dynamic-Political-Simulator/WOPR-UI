import React, { useEffect } from "react";
import L, { LatLngBoundsExpression } from "leaflet";
import "./Map.css";
import { SVGIcon } from "./SVGIcon/SVGIcon";
import SVGIconOptions from "./SVGIcon/SVGIconOptions";
import { PlanetEntry, baseX, baseY } from "./MapEdit";
import { Button, Jumbotron } from "reactstrap";

function Map() {
    let map: L.Map;
    let image;

    function getPlanets(map: L.Map) {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET"
        };

        fetch("https://localhost:44394/api/map/get", requestInit)
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
                    marker.bindPopup((element.description == null ? "n u l l" : element.description).replace('\n', "<br/>") + "<br/><a href=\"../planet?name=" + element.name + "\">[More Detail]</a>");
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
        if (map == null) {
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
        }
        let bounds: LatLngBoundsExpression = [[0, 0], [1000, 1000]];
        image = L.imageOverlay("../images/galacticmapnotext.png", bounds).addTo(map);

        getPlanets(map);
    }, []);

    return (
        <div id="galacticMap"></div>
    )
}

export default Map;