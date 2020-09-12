import React, { useState, useEffect } from "react";
import { Header, Icon, Segment, Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import {
    useStateValue,
    modifyPatient,
    setDiagnosisList,
    addPatientEntry,
} from "../state";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientDetailedPage: React.FC = () => {
    const [patient, setPatient] = useState<Patient | undefined>(undefined);
    const [{ diagnoses, patientsSensitive }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();
    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    useEffect(() => {
        const getPatientInfo = async () => {
            try {
                if (patientsSensitive[id]) {
                    setPatient(patientsSensitive[id]);
                } else {
                    const patientDataPromise = await axios.get(
                        `${apiBaseUrl}/patients/${id}`
                    );
                    const patientData = await patientDataPromise.data;
                    dispatch(modifyPatient(patientData));
                    setPatient(patientData);
                }
            } catch (e) {
                console.error(e.response.data);
            }
        };

        const getDiagnoses = async () => {
            try {
                if (Object.keys(diagnoses).length === 0) {
                    const diagnosesPromise = await axios.get(
                        `${apiBaseUrl}/diagnoses/`
                    );
                    const diagnosisData = await diagnosesPromise.data;
                    dispatch(setDiagnosisList(diagnosisData));
                }
            } catch (e) {
                console.error(e.response.data);
            }
        };
        getPatientInfo();
        getDiagnoses();
    }, [id, dispatch, patientsSensitive, diagnoses]);

    const submitNewEntry = async (values: EntryFormValues) => {
        try {
            const { data: newEntry } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/${id}/entries`,
                values
            );
            dispatch(addPatientEntry(newEntry, id));
            if (patient) {
                const patientCopy: Patient = {
                    ...patient,
                    entries: [...patient.entries, newEntry],
                };
                setPatient(patientCopy);
            }

            console.log("new entry", newEntry);
            closeModal();
        } catch (e) {
            console.error(e.response.data);
            setError(e.response.data.error);
        }
    };

    return (
        <div>
            {patient ? (
                <div>
                    <Header as="h1">
                        {patient.name}{" "}
                        <Icon
                            name={
                                patient.gender === "male"
                                    ? "mars"
                                    : patient.gender === "female"
                                    ? "venus"
                                    : "genderless"
                            }
                        />{" "}
                    </Header>
                    {patient.ssn ? <p>SSN: {patient.ssn}</p> : <div />}
                    <p>Occupation: {patient.occupation}</p>
                    <p>Born: {patient.dateOfBirth}</p>
                    <Header as="h3">entries</Header>
                    <Button onClick={() => openModal()}>Add new entry</Button>
                    {patient.entries.length === 0 ? (
                        <p>no entries</p>
                    ) : (
                        patient.entries.map((entry) => (
                            <Segment key={entry.id}>
                                <EntryDetails entry={entry} />
                                <ul>
                                    {entry.diagnosisCodes?.map((code) => (
                                        <li key={code}>
                                            {code}: {diagnoses[code]?.name}
                                        </li>
                                    ))}
                                </ul>
                            </Segment>
                        ))
                    )}
                </div>
            ) : (
                "loading..."
            )}
            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
            />
        </div>
    );
};

export default PatientDetailedPage;
