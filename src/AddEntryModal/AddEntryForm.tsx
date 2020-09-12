import React from "react";
import { Grid, Button } from "semantic-ui-react";
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
            }}
            onSubmit={onSubmit}
            validate={(values) => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.description) {
                    errors.description = requiredError;
                }
                if (!values.type) {
                    errors.type = requiredError;
                }
                if (!values.date) {
                    errors.date = requiredError;
                }
                if (!values.specialist) {
                    errors.specialist = requiredError;
                }
                return errors;
            }}
        >
            {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
                return (
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
                );
            }}
        </Formik>
    );
};

export default AddEntryForm;
