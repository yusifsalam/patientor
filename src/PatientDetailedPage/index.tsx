import React, { useState, useEffect } from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useStateValue, modifyPatient, setDiagnosisList } from "../state";
import EntryDetails from "./EntryDetails";

const PatientDetailedPage: React.FC = () => {
    const [patient, setPatient] = useState<Patient | undefined>(undefined);
    const [{ diagnoses, patientsSensitive }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();
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
                    {patient.entries.length === 0 ? (
                        <p>no entries</p>
                    ) : (
                        patient.entries.map((entry) => (
                            <Segment key={entry.id}>
                                <EntryDetails entry={entry} />
                                <ul>
                                    {entry.diagnosisCodes?.map((code) => (
                                        <li>
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
        </div>
    );
};

export default PatientDetailedPage;
