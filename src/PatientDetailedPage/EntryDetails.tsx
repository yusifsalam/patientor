import React from "react";
import { Entry } from "../types";
import { Icon, Header } from "semantic-ui-react";
import { HealthCheckRating } from "./HealthCheckRating";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "HealthCheck":
            return (
                <div>
                    <Header as="h3">
                        {entry.date} <Icon name="user md" />
                    </Header>
                    <p>{entry.description}</p>
                    <HealthCheckRating rating={entry.healthCheckRating} />
                </div>
            );
        case "Hospital":
            return (
                <div>
                    <Header as="h3">
                        {entry.date} <Icon name="hospital" />
                    </Header>
                    <p>
                        Discharged {entry.discharge.date}, reason:{" "}
                        {entry.discharge.criteria}
                    </p>
                </div>
            );

        case "OccupationalHealthcare":
            return (
                <div>
                    <Header as="h3">
                        {entry.date} <Icon name="stethoscope" />{" "}
                        {entry.employerName}
                    </Header>
                    <p>{entry.description}</p>
                    {entry.sickLeave ? (
                        <p>
                            Sick leave from {entry.sickLeave.startDate} to{" "}
                            {entry.sickLeave.endDate}
                        </p>
                    ) : (
                        <div />
                    )}
                </div>
            );
        default:
            return <div />;
    }
};

export default EntryDetails;
