import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_MANUAL_PLAN, GET_USER, MANUAL_PLAN} from "../helpers/gqlQueries";
import {Spinner, Toast, ToastContainer} from "react-bootstrap";
import {FaLeaf} from "react-icons/all";

const FertilizerPlan = () => {
    const {data: manualPlanData, loading: loadingManualPlan, error: ErrorManualPlan} = useQuery(MANUAL_PLAN);
    const [updateManualPlan, {
        loading: loadingUpdateManualPlan,
        error: ErrorUpdateManualPlan
    }] = useMutation(ADD_MANUAL_PLAN);
    const {data: userData} = useQuery(GET_USER)

    const [showToast, setShowToast] = useState(false);
    const toggleShowToast = () => setShowToast(!showToast);


    const validate = Yup.object().shape({
        fertilizer: Yup.number()
            .min(1, "Minimalna wartość to 0")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
        fertilizer_interval: Yup.number()
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
            { !manualPlanData &&
                <div className={'mt-2'} style={{textAlign: 'center'}}>
                    <Spinner animation="border" variant="primary" className={'spinner'}/>
                </div>
            }
            {manualPlanData &&
            <Formik
                initialValues={{
                    fertilizer: manualPlanData.manualProfile.fertilizer || 0,
                    fertilizer_interval: manualPlanData.manualProfile.fertilizer_interval || 0,
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                    updateManualPlan({
                        variables: {
                            fertilizer: values.fertilizer,
                            fertilizer_interval: values.fertilizer_interval
                        }
                    }).then(()=>{
                        setShowToast(true)
                        setTimeout(()=>{
                            setShowToast(false)
                        }, 3000)
                    })
                }}
            >
                <Form>
                    <div className={'row'}>
                        <div className={'col-md-4 col-lg-4 col-xl-2 mb-1'}>
                            <label>Ilość nawozu (ml)</label>
                            <Field id={"fertilizer"} name={"fertilizer"} type="number"
                                   className="form-control" placeholder="Ilość (ml)"
                            />
                            <ErrorMessage name="fertilizer" render={msg => <div className={'form-error'}>{msg}</div>}/>
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <label>Powtarzanie (dni)</label>
                            <Field id={"fertilizer_interval"} name={"fertilizer_interval"} type="number"
                                   className="form-control" placeholder="Powtarzaj (dni)"
                            />
                            <ErrorMessage name="fertilizer_interval"
                                          render={msg => <div className={'form-error'}>{msg}</div>}/>
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1 mt-4'}>
                            <button type="submit" className="btn btn-primary" disabled={loadingUpdateManualPlan || (userData && userData.me.role !== 'ADMIN')}>
                                {!loadingUpdateManualPlan ? 'Zapisz' :
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
            }
            <ToastContainer className="p-3" position={'bottom-end'}>
                <Toast show={showToast} onClose={toggleShowToast}>
                    <Toast.Header>
                        <FaLeaf style={{color: '#064635', fontSize: '16px', marginRight: '5px'}}/>
                        <strong className="me-auto">Smart Garden</strong>
                        <small>3sec temu </small>
                    </Toast.Header>
                    <Toast.Body>Dane zostały zapisane!</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default FertilizerPlan;
