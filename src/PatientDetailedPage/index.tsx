import React, { useState, useEffect } from "react";
import { Header, Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import { useStateValue } from "../state";

const PatientDetailedPage: React.FC = () => {
    const [patient, setPatient] = useState<Patient | undefined>(undefined);
    const [{ patientsSensitive }, dispatch] = useStateValue();
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
                    dispatch({ type: "MODIFY_PATIENT", payload: patientData });
                    setPatient(patientData);
                }
            } catch (e) {
                console.error(e.response.data);
            }
        };
        getPatientInfo();
    }, [id, dispatch, patientsSensitive]);

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
                </div>
            ) : (
                "loading..."
            )}
        </div>
    );
};

export default PatientDetailedPage;
