import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Jumbotron, Table } from "reactstrap";

export interface AlignmentOverview {
    alignmentId: string
    alignmentName: string
    federalismCentralism: number
    democracyAuthority: number
	globalismIsolationism: number
	militarismPacifism: number
	securityFreedom: number
	cooperationCompetition: number
	secularismSpiritualism: number
	progressivismTraditionalism: number
	monoculturalismMulticulturalism: number
}

export function PopsimAlignments() {
    const [data, setData] = useState<AlignmentOverview[]|undefined>(undefined);

    const history = useHistory();

    useEffect(() => {
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://localhost:44394/api/popsim/alignment-overview", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }, []);

    function handleEditClick(id:string){
        history.push('edit-alignment?id=' + id);
    }

    return (
       // <Container>
            <Jumbotron>
                <h1>Alignments</h1>
                <hr className="my-2"/>

                <Table striped>
                    <thead>
                        <tr>
                            <th>Alignment</th>
                            <th>Federalism - Centralism</th>
                            <th>Democracy - Authority</th>
                            <th>Globalism - Isolationism</th>
                            <th>Militarism - Pacifism</th>
                            <th>Security - Freedom</th>
                            <th>Cooperation - Competition</th>
                            <th>Secularism - Spiritualism</th>
                            <th>Progressivism - Traditionalism</th>
                            <th>Monocultarism - Multiculturalism</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((a) => (
                            <tr key={a.alignmentId}>
                                <th scope="row">{a.alignmentName}</th>
                                <td>{a.federalismCentralism}</td>
                                <td>{a.democracyAuthority}</td>
                                <td>{a.globalismIsolationism}</td>
                                <td>{a.militarismPacifism}</td>
                                <td>{a.securityFreedom}</td>
                                <td>{a.cooperationCompetition}</td>
                                <td>{a.secularismSpiritualism}</td>
                                <td>{a.progressivismTraditionalism}</td>
                                <td>{a.monoculturalismMulticulturalism}</td>
                                {a.alignmentName != "Apolitical" ? <td><Button onClick={() => handleEditClick(a.alignmentId)}>Edit</Button></td> : null }
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Jumbotron>
        //</Container>
    )
}