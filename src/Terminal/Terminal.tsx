import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { TerminalCommand } from "./CommandService";
import { useCookies } from "react-cookie";

export function Terminal() {
  const [rows, setRows] = useState<string[]>(["Welcome to WOPR"]);

  const [commandInput, setCommandInput] = useState<string>("");
  const [cookies, setCookie] = useCookies();
  
  useEffect(() => {
    setTimeout(() => {
      setRows(rows => [...rows, "System ready"]);
    },
    500);
  }, []);

  useEffect(() => {
    var isAdmin = cookies["isAdmin"]

    if (isAdmin == undefined){
      var requestInit: RequestInit = {
        mode: "cors",
        credentials: "include",
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
      };

      fetch("https://localhost:44394/api/user/is-admin", requestInit)
        .then((response) => response.json())
        .then((response) => {
            setCookie("isAdmin", response);
        });
    }

  })

  const inputCommand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRows(rows => [...rows, commandInput]);

    if(commandInput == "popsim"){
      window.location.assign("/popsim")
    }
    else{
      TerminalCommand(commandInput).then((response) => {
        setRows(rows => [...rows, response]);
      });
    }

    setCommandInput("")
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCommandInput(e.target.value);
  }

  return (
    <>
      <div className="ml-5 mt-5">
        {rows.map(function(row, i) {
          return (
            <Row key={i}>
              <Col className="text-success" >{"=>"} {row}</Col>
            </Row>
          );
        })}
      </div>
      <form className="ml-4 mt-2 d-inline-flex" onSubmit={inputCommand}>
        <p className="bg-transparent text-success">{">"}</p>
        <input className="bg-transparent text-success" style={{border: "none"}} value={commandInput} onChange={handleOnChange} />
      </form>
    </>
  );
}
