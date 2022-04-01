import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";
import TimePicker from "./TimePicker";
import React from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_MANUAL_PLAN, MANUAL_PLAN} from "../helpers/gqlQueries";

const FertilizerPlan = () => {
    // const {data: manualPlanData, loading: loadingManualPlan, error: ErrorManualPlan} = useQuery(MANUAL_PLAN);
    // const [updateManualPlan, {
    //     loading: loadingUpdateManualPlan,
    //     error: ErrorUpdateManualPlan
    // }] = useMutation(ADD_MANUAL_PLAN);


    const validate = Yup.object().shape({
        quantity: Yup.number()
            .min(1, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
        repeat: Yup.number()
            .min(1, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
    });

    return (
        <>
            <div className={'title mt-3 mb-3'}>
                    <span>
                        <h4 style={{display: 'inline-block'}}>Dozowanie nawozu</h4>
                    </span>
            </div>
            <Formik
                initialValues={{

                }}
                validationSchema={validate}
                onSubmit={(values) => {

                }}
            >
                <Form>
                    <div className={'row'}>
                        <div className={'col-md-4 col-lg-4 col-xl-2 mb-1'}>
                            <Field id={"quantity"} name={"quantity"} type="number"
                                   className="form-control" placeholder="Ilość (ml)"
                            />
                            <ErrorMessage name="quantity" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <Field id={"repeat"} name={"repeat"} type="number"
                                   className="form-control" placeholder="Powtarzaj (dni)"
                            />
                            <ErrorMessage name="repeat" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <button type="submit" className="btn btn-primary" disabled={false}>
                                {true ? 'Zapisz' :
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    )
}

export default FertilizerPlan;
