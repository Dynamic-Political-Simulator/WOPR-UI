import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { TerminalCommand } from "./CommandService";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { checkAuth } from "../Auth/AuthService";
import "./TerminalStyle.css";

export function Terminal() {
    // Just some boot-up logo concepts
    /* 
    W     W  OOO  PPPP  RRRR
    W     W O   O P   P R   R
    W  W  W O   O PPPP  RRRR
     W W W  O   O P     R R
      W W    OOO  P     R  RR
    */
    /*
    ██  ██  ██ ██████ ██████ ██████
    ██  ██  ██ ██  ██ ██  ██ ██  ██
     ██ ██ ██  ██  ██ █████  ████
      ██████   ██████ ██     ██  ██
    */
    const [rows, setRows] = useState<string[]>([
        "██      ██ ██████ ██████ ██████",
        "██  ██  ██ ██  ██ ██  ██ ██  ██",
        " ██ ██ ██  ██  ██ █████  ████",
        "  ██  ██   ██████ ██     ██  ██",
        "Welcome to WOPR"
    ]);

    const [commandInput, setCommandInput] = useState<string>("");

    const [processing, setProcessing] = useState<boolean>(true);

    const [cookies, setCookie] = useCookies();

    const history = useHistory();

    useEffect(() => {
        checkAuth(cookies, setCookie);
        setTimeout(() => {
            document.addEventListener("click", () => {
                let element = document.getElementById("inputter");
                if (element == null) return;
                element.focus();
            }); // a clinically insane thing to do, I agree
            setRows(rows => [...rows, "System ready"]);
            setProcessing(false); // Enable the input as everything is loaded.
        },
            500);
    }, []);

    useEffect(() => {
        let scrollingElement = document.scrollingElement!;
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }, [rows, processing]);

    const inputCommand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setRows(rows => [...rows, "┌─[WOPR]"]);
        setRows(rows => [...rows, "└─▪ " + commandInput]); // Holy shit the fucking alignment
        setProcessing(true); // We don't want the user to spam input, that'll look bad.

        TerminalCommand(commandInput)
            .then((response) => response.text())
            .then((response) => {
                console.log(String(response));
                if (String(response).startsWith("redirect-")) {
                    let redirect = String(response).replace("redirect-", "");
                    history.push("/" + redirect);
                }
                else {
                    setRows(rows => [...rows, response]);
                    setProcessing(false);
                }
            });

        setCommandInput("");
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCommandInput(e.target.value);
    }

    return (
        <div className="terminal">

            <div id="history" className="mt-5" style={{
                marginLeft: "0.75rem"
            }}>
                {rows.map(function (row, i) {
                    return (
                        <Row key={i} style={{
                            marginRight: 0,
                            marginLeft: 0
                        }}>
                            <Col><pre className="terminal">{row}</pre></Col>
                        </Row>
                    );
                })}
            </div>
            <div className="bg-transparent" style={{
                marginLeft: "1.7rem",
                marginBottom: "-0.5rem"
            }} hidden={processing}>{"┌─[WOPR]"}</div>
            <form className="mt-2 d-inline-flex" style={{
                width: "calc(100vw - 1.75rem)",
                overflow: "hidden",
                height: "5%",
                marginLeft: "1.7rem"
            }} onSubmit={inputCommand} hidden={processing}>
                <div className="bg-transparent" style={{
                    width: "auto"
                }} hidden={processing}>{"└─▪"}&nbsp;</div>
                <input id="inputter" className="bg-transparent" style={{
                    border: "none",
                    outline: "none",
                    width: "100%"
                }} value={commandInput} onChange={handleOnChange} disabled={processing} hidden={processing} />
            </form>
        </div >
        // <input className="bg-transparent text-success" style={{ border: "none" }} value={commandInput} onChange={handleOnChange} />
        /*
            ┌─[~][]
            └─▪
        */
        /*
             <div id="termBg" />
             <div id="termFg">
             </div>
        */
    );
}
