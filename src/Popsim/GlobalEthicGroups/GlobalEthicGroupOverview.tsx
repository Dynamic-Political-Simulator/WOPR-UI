import { useState } from "react"
import { Jumbotron, Tab } from "react-bootstrap";
import { Container, Table } from "reactstrap";

interface GlobalEthicGroup {
    globalEthicGroupId: string;
    globalEthicGroupName: string;
    partyInvolvementFactor: number;
    radicalistion: number;
    partyEnlistmentModifier: number;

    federalismCentralism: number;
    democracyAuthority: number;
	globalismIsolationism: number;
	militarismPacifism: number;
	securityFreedom: number;
	cooperationCompetition: number;
	secularismSpiritualism: number;
	progressivismTraditionalism: number;
	monoculturalismMulticulturalism: number;

    percentage: number;
    totalPopulation: number;
}

export function GlobalEthicGroupOverview(){
    const [data, setData] = useState<GlobalEthicGroup[]>();

    return(
        <>
        {data == undefined ? <div>loading</div> :
        <Container>
            <Jumbotron>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Party Involvement Factor</th>
                            <th>Radicalisation</th>
                            <th>Party Enlistment Modifier</th>

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
                        {data.map((g) => (
                            <tr key={g.globalEthicGroupId}>
                                <th>{g.globalEthicGroupName}</th>
                                <th>{g.partyInvolvementFactor}</th>
                                <th>{g.radicalistion}</th>
                                <th>{g.partyEnlistmentModifier}</th>

                                <td>{g.federalismCentralism}</td>
                                <td>{g.democracyAuthority}</td>
                                <td>{g.globalismIsolationism}</td>
                                <td>{g.militarismPacifism}</td>
                                <td>{g.securityFreedom}</td>
                                <td>{g.cooperationCompetition}</td>
                                <td>{g.secularismSpiritualism}</td>
                                <td>{g.progressivismTraditionalism}</td>
                                <td>{g.monoculturalismMulticulturalism}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Jumbotron>
        </Container>
        }
        </>
    )
}