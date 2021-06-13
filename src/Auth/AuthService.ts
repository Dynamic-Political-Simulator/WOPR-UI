import { log } from "console";

export function checkAuth(cookies:any, setCookie: any){
    let isAdmin = cookies["isAdmin"]

    if (isAdmin === undefined){
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
            })
            .catch(() => {
                window.location.href = "https://localhost:44394/api/auth/auth";
            });

    }
}