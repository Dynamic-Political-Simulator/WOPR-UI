import { SSL_OP_EPHEMERAL_RSA } from "constants";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Input, Row } from "reactstrap";
import {Redirect} from 'react-router-dom';

export function Terminal() {
  const [rows, setRows] = useState<string[]>(["Welcome to WOPR"]);

  const [commandInput, setCommandInput] = useState<string>("");

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

  useEffect(() => {
    async function fetchData(){
      await fetch("https://localhost:44394/api/terminal/terminal", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((response) => {
        //put the response into the terminal
      });
    }
  })

  const inputCommand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(commandInput == "popsim"){
      window.location.assign("/popsim")
    }
    else if(commandInput.startsWith("login ")){
      
    }

    setRows(rows => [...rows, commandInput]);
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
