import { useEffect } from "react";
import { useState } from "react"
import { Tab } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Container, Jumbotron, Label, Table } from "reactstrap";

interface PopsimPartyOverviewReturn{
    upperPartyPercentage: number;
    globalEthicGroups: PopsimOverviewGlobalEthicGroup[];
    alignments: PopsimOverviewAlignment[];
}

interface PopsimOverviewGlobalEthicGroup{
    name: string;
    partyInvolvementFactor: number;
    radicalisation: number;
    partyEnlistmentModifier: number;

    popGroupEnlistment: number;
    upperPartyMembership: number;
    lowerPartyMembership: number;

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

interface PopsimOverviewAlignment {
    name: string;
    establishment: number;
    upperPartyModifier: number;
    lowerPartyModifier: number;
    upperPartyAffinity: number;
    lowerPartyAffinity: number;
    cliques: string[];

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

export function PartyOverview(){
    const [data, setData] = useState<PopsimPartyOverviewReturn>();

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

        fetch(process.env.BASE_URL + "popsim/overview", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response))
            .catch(() => history.push("/"));   
    })

    return (
        <>
        {data == undefined ? <div>loading</div> : 
        <Container>
            <Jumbotron>
                <Label>Upper Party Percentage: {data.upperPartyPercentage}</Label>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Alignment</th>
                            <th>Establishment</th>
                            <th>Upper Party Modifier</th>
                            <th>Lower Party Modifier</th>
                            <th>Upper Party Affinity</th>
                            <th>Lower Party Affinity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.alignments.map((a) => (
                            <tr key={a.name}>
                                <th>{a.name}</th>
                                <th>{a.establishment}</th>
                                <th>{a.upperPartyModifier}</th>
                                <th>{a.lowerPartyModifier}</th>
                                <th>{a.upperPartyAffinity}</th>
                                <th>{a.lowerPartyAffinity}</th>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Table striped>
                    <thead>
                        <tr>
                            <th>Global Ethic Group</th>
                            <th>Party Involvement Factor</th>
                            <th>Radicalisation</th>
                            <th>Party Enlistment Modifier</th>
                            <th>Pop Group Enlistment</th>
                            <th>Upper Party Membership</th>
                            <th>Lower Party Membership</th>
                        </tr>
                    </thead>
                </Table>
            </Jumbotron>
        </Container>
        }
        </>
    )
}