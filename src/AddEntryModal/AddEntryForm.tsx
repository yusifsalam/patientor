import React from "react";
import { Grid, Button, Message } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import {
    TextField,
    SelectEntryField,
    DiagnosisSelection,
    NumberField,
} from "../AddPatientModal/FormField";
import { Entry, EntryType } from "../types";
import { useStateValue } from "../state";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = Omit<Entry, "id">;

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

export type EntryTypeOption = {
    value: EntryType;
    label: string;
};

const entryOptions: EntryTypeOption[] = [
    { value: EntryType.HealthCheck, label: "Health Check" },
    { value: EntryType.Hospital, label: "Hospital" },
    {
        value: EntryType.OccupationalHealthcare,
        label: "Occupational Healthcare",
    },
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [{ diagnoses }] = useStateValue();
    return (
        <Formik
            initialValues={{
                description: "",
                type: EntryType.HealthCheck,
                date: "",
                specialist: "",
                diagnosisCodes: [],
                healthCheckRating: "",
            }}
            onSubmit={onSubmit}
            validate={(values) => {
                const requiredError = (field: string) =>
                    `Field ${field} is required`;
                const errors: { [field: string]: string } = {};
                if (!values.description) {
                    errors.description = requiredError("Description");
                }
                if (!values.type) {
                    errors.type = requiredError("Type");
                }
                if (!values.date) {
                    errors.date = requiredError("Date");
                }
                if (!Date.parse(values.date)) {
                    errors.date = "Please enter valid date";
                }
                if (!values.specialist) {
                    errors.specialist = requiredError("Specialist");
                }
                if (
                    values.type === EntryType.HealthCheck &&
                    !values.healthCheckRating
                ) {
                    errors.healthCheckRating = requiredError(
                        "Health check rating"
                    );
                }

                if (![0, 1, 2, 3].includes(Number(values.healthCheckRating))) {
                    errors.healthCheckRating =
                        "Health check rating must be an integer between 0 and 3";
                }
                return errors;
            }}
        >
            {({
                isValid,
                dirty,
                setFieldValue,
                setFieldTouched,
                values,
                errors,
            }) => {
                return (
                    <div>
                        {Object.values(errors).length !== 0 ? (
                            <Message error>
                                <Message.Header>Form error</Message.Header>
                                <Message.List>
                                    {Object.values(errors).map((error, i) => (
                                        <Message.Item key={i}>
                                            {error}
                                        </Message.Item>
                                    ))}
                                </Message.List>
                            </Message>
                        ) : (
                            <div />
                        )}
                        <Form className="form ui">
                            <SelectEntryField
                                label="Type"
                                name="type"
                                options={entryOptions}
                            />
                            <Field
                                label="Description"
                                placeholder="Description"
                                name="description"
                                component={TextField}
                            />

                            <Field
                                label="Date"
                                placeholder="YYYY-MM-DD"
                                name="date"
                                component={TextField}
                            />
                            <Field
                                label="Specialist"
                                placeholder="Specialist"
                                name="specialist"
                                component={TextField}
                            />
                            <DiagnosisSelection
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                diagnoses={Object.values(diagnoses)}
                            />
                            {values.type === "HealthCheck" ? (
                                <Field
                                    label="Health Check rating"
                                    name="healthCheckRating"
                                    min={0}
                                    max={3}
                                    component={NumberField}
                                />
                            ) : values.type === "Hospital" ? (
                                <p> this is not implemented, do not use</p>
                            ) : (
                                <p> this is not implemented, do not use</p>
                            )}

                            <Grid>
                                <Grid.Column floated="left" width={5}>
                                    <Button
                                        type="button"
                                        onClick={onCancel}
                                        color="red"
                                    >
                                        Cancel
                                    </Button>
                                </Grid.Column>
                                <Grid.Column floated="right" width={5}>
                                    <Button
                                        type="submit"
                                        floated="right"
                                        color="green"
                                        disabled={!dirty || !isValid}
                                    >
                                        Add
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
};

export default AddEntryForm;
