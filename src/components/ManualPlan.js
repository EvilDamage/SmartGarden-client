import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from "yup";
import TimePicker from "./TimePicker";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_MANUAL_PLAN, GET_USER, MANUAL_PLAN} from "../helpers/gqlQueries";
import {Spinner, Toast, ToastContainer} from "react-bootstrap";
import {FaLeaf} from "react-icons/all";

const ManualPlan = () => {
    const {data: manualPlanData, loading: loadingManualPlan, error: ErrorManualPlan} = useQuery(MANUAL_PLAN);
    const [updateManualPlan, {
        loading: loadingUpdateManualPlan,
        error: ErrorUpdateManualPlan
    }] = useMutation(ADD_MANUAL_PLAN);
    const {data: userData} = useQuery(GET_USER)

    const [showToast, setShowToast] = useState(false);
    const toggleShowToast = () => setShowToast(!showToast);


    const validate = Yup.object().shape({
        air_temperature: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .max(100, "Maksymalna wartość to 100")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
        air_humidity: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .max(100, "Maksymalna wartość to 100")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
        soil_humidity: Yup.number()
            .min(0, "Minimalna wartość to 0")
            .max(100, "Maksymalna wartość to 100")
            .typeError('Wartość musi być liczbą')
            .required("Pole jest wymagane"),
        light: Yup.object().shape({
            minimumLevel: Yup.number()
                .min(0, "Minimalna wartość to 0")
                .max(100, "Maksymalna wartość to 100")
                .typeError('Wartość musi być liczbą')
                .required("Pole jest wymagane"),
        })

    });

    return (
        <>
            <div className={'title mt-3 mb-3'}>
                    <span>
                        <h4 style={{display: 'inline-block'}}>Dane manualne</h4>
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
                    air_temperature: manualPlanData.manualProfile.air_temperature || 0,
                    air_humidity: manualPlanData.manualProfile.air_humidity || 0,
                    soil_humidity: manualPlanData.manualProfile.soil_humidity || 0,
                    light: {
                        start_hour: manualPlanData.manualProfile.light.start_hour || '8:00',
                        end_hour: manualPlanData.manualProfile.light.end_hour || '18:00',
                        minimumLevel: manualPlanData.manualProfile.light.minimumLevel || 0,
                    }
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                    updateManualPlan({
                        variables: {
                            air_humidity: values.air_humidity,
                            soil_humidity: values.soil_humidity,
                            air_temperature: values.air_temperature,
                            light: values.light
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
                            <label>Temperatura powietrza</label>
                            <Field id={"air_temperature"} name={"air_temperature"} type="number"
                                   className="form-control" placeholder="Temperatura" min={0} max={100}
                            />
                            <ErrorMessage name="air_temperature" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <label>Wilgotność powietrza</label>
                            <Field id={"air_humidity"} name={"air_humidity"} type="number"
                                   className="form-control" placeholder="Wilgotność" min={0} max={100}
                            />
                            <ErrorMessage name="air_humidity" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <label>Wilgotność gleby</label>
                            <Field id={"soil_humidity"} name={"soil_humidity"} type="number"
                                   className="form-control" placeholder="Wilgotność gleby" min={0} max={100}
                            />
                            <ErrorMessage name="soil_humidity" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <label>Godziny doświetlania</label>
                            <Field name={'light'}>
                                {({field, form, meta}) => {
                                    const setupTimeCallback = (start, end) => {
                                        field.value.start_hour = start
                                        field.value.end_hour = end
                                    }
                                    return (<div>
                                        <TimePicker {...field} start={field.value.start_hour}
                                                    end={field.value.end_hour} setupTime={setupTimeCallback}/>
                                    </div>)
                                }}
                            </Field>
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2  mb-1'}>
                            <label>Min. poziom oświetlenia</label>
                            <Field id={"light.minimumLevel"} name={"light.minimumLevel"} type="number"
                                   className="form-control" placeholder="Poziom oświetlenia" min={0} max={100}
                            />
                            <ErrorMessage name="light.minimumLevel" render={msg => <div className={'form-error'}>{msg}</div>} />
                        </div>
                        <div className={'col-md-4 col-lg-4 col-xl-2 mb-1 mt-4'}>
                            <button type="submit" className="btn btn-primary" disabled={loadingUpdateManualPlan  || (userData && userData.me.role !== 'ADMIN')}>
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

export default ManualPlan;
