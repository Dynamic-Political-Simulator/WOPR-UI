import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { TerminalCommand } from "./CommandService";

export function Terminal() {
  const [rows, setRows] = useState<string[]>(["Welcome to WOPR"]);

  const [commandInput, setCommandInput] = useState<string>("");
  
  useEffect(() => {
    setTimeout(() => {
      setRows(rows => [...rows, "System ready"]);
    },
    500);
  }, []);

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
