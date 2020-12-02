import { SSL_OP_EPHEMERAL_RSA } from "constants";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";

export function Terminal() {
  const [rows, setRows] = useState<string[]>(["Welcome to WOPR"]);

  const [commandInput, setCommandInput] = useState<string>(">");

  //function inputCommand() {
    //if (commandInput !== undefined) {
      //@ts-ignore
      //setRows(rows => [...rows, commandInput]);
    //}
  //}

  
  useEffect(async() => {
    setTimeout(() => {
      setRows(rows => [...rows, "System ready"]);
    },
    500);
  }, []);

  const inputCommand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //@ts-ignore
    var commandWithoutPrefix = commandInput.split(">")[1];
    setRows(rows => [...rows, commandWithoutPrefix]);
    setCommandInput(">");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(e.target.value.indexOf(">") === 0){
      setCommandInput(e.target.value);
    }    
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
      <form className="ml-4 mt-2" onSubmit={inputCommand}>
        <input className="bg-transparent text-success" style={{border: "none"}} value={commandInput} onChange={handleOnChange} />
      </form>
    </>
  );
}
