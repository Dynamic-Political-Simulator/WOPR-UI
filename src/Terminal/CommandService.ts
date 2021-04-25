export async function TerminalCommand(command: string) {
    var requestInit: RequestInit = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({InputString: command}),
    };  
  
    return fetch("https://localhost:44394/api/terminal/command", requestInit)
      .then(responeHandler)
      .then((responseString) => {      
        return responseString;
    });
}


function responeHandler(response: Response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text);
  
        if (!response.ok) {
            if (response.status === 401) {
                //Logout();
            }
        
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
  
        return data;
    });
}
