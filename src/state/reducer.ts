import { State } from "./state";
import { Patient, Diagnosis, AddPatientPayload } from "../types";

export type Action =
    | {
          type: "SET_PATIENT_LIST";
          payload: Patient[];
      }
    | {
          type: "ADD_PATIENT";
          payload: Patient;
      }
    | {
          type: "MODIFY_PATIENT";
          payload: Patient;
      }
    | {
          type: "SET_DIAGNOSIS_LIST";
          payload: Diagnosis[];
      }
    | {
          type: "ADD_PATIENT_ENTRY";
          payload: AddPatientPayload;
      };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_PATIENT_LIST":
            return {
                ...state,
                patients: {
                    ...action.payload.reduce(
                        (memo, patient) => ({ ...memo, [patient.id]: patient }),
                        {}
                    ),
                    ...state.patients,
                },
            };
        case "SET_DIAGNOSIS_LIST":
            return {
                ...state,
                diagnoses: {
                    ...action.payload.reduce(
                        (memo, diagnosis) => ({
                            ...memo,
                            [diagnosis.code]: diagnosis,
                        }),
                        {}
                    ),
                    ...state.diagnoses,
                },
            };
        case "ADD_PATIENT":
            return {
                ...state,
                patients: {
                    ...state.patients,
                    [action.payload.id]: action.payload,
                },
            };
        case "MODIFY_PATIENT":
            return {
                ...state,
                patientsSensitive: {
                    ...state.patientsSensitive,
                    [action.payload.id]: action.payload,
                },
            };
        case "ADD_PATIENT_ENTRY":
            return {
                ...state,
                patients: {
                    ...state.patients,
                    [action.payload.patientId]: {
                        ...state.patients[action.payload.patientId],
                        [action.payload.entry.id]: action.payload.entry,
                    },
                },
            };
        default:
            return state;
    }
};
