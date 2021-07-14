import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Jumbotron, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";

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

interface ModalDeleteData {
    id: string
    name: string
}

export function PopsimAlignments() {
    const [data, setData] = useState<AlignmentOverview[]|undefined>(undefined);
    const [modal, setModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ModalDeleteData>();

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

        fetch(process.env.BASE_URL + "alignment/alignment-overview", requestInit)
            .then((response) => response.json())
            .then((response) => setData(response));
    }, []);

    function handleEditClick(id:string){
        history.push('edit-alignment?id=' + id);
    }

    function handleDeleteClick(id:string, name: string){
        setModalData({id: id, name: name})
        setModal(true);
    }

    function handleDeleteConfirmClick(){
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "alignment/delete-alignment?id=" + modalData?.id, requestInit)
            .then(() => history.go(0));
    }

    function handleCreateClick(){
        var requestInit: RequestInit = {
            mode: "cors",
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(process.env.BASE_URL + "popsim/create-alignment", requestInit)
            .then(() => history.go(0));
    }

    return (
        <>
            <Jumbotron>
                <h1>Alignments</h1>
                <Button onClick={handleCreateClick}>Create Alignment</Button>
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
                                {a.alignmentName != "Apolitical" ? <td><Button color="danger" onClick={() => handleDeleteClick(a.alignmentId, a.alignmentName)}>Delete</Button></td> : null }
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Jumbotron>
            <Modal isOpen={modal}>
                    <ModalHeader>
                        Are you sure you want to delete {modalData?.name}?
                    </ModalHeader>
                    <ModalBody>
                        This action is permanent and cannot be reversed.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleDeleteConfirmClick}>Delete</Button>{' '}
                        <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </ModalFooter>
            </Modal>
        </>
    )
}