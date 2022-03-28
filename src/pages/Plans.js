import Banner from "../components/Banner";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_MANUAL_PLAN,
    ADD_PLANS,
    DELETE_PLAN,
    GET_PLANS,
    GET_SETTINGS, HISTORY, MANUAL_PLAN,
    UPDATE_SETTINGS
} from "../helpers/gqlQueries";
import React, {useEffect, useState} from "react";
import {BsFillLightbulbFill, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";
import {formatDateForDisplay} from "../helpers/dataParse";
import {Form as BootstrapForm, Modal, Spinner} from "react-bootstrap";
import TimePicker from "../components/TimePicker";
import History from "../components/History";
import ManualPlan from "../components/ManualPlan";
import CreatePlan from "../components/CreatePlan";

import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import * as Yup from "yup";

const Plans = () => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [reload, setReload] = useState(false)

    const [updatePlan, {loading: loadingUpdatePlan, error: ErrorUpdatePlan}] = useMutation(ADD_PLANS);

    const addEmptyPlanItem = (e, field, values, setValues) => {
        const schedule = [...values.schedule];
        schedule.push({
            air_temperature: null,
            air_humidity: null,
            soil_humidity: null,
            duration: null,
            light: {
                start_hour: '8:00',
                end_hour: '18:00',
                minimumLevel: null,
            },
        })
        setValues({...values, schedule});
        field.onChange(e);
    }

    const removePlanItem = (e, field, values, setValues) => {
        const schedule = [...values.schedule].slice(0, -1);
        setValues({...values, schedule});
        field.onChange(e);
    }

    const validate = Yup.object().shape({
        name: Yup.string()
            .required("Pole jest wymagane")
            .min(1, 'Nazwa jest za krótka'),
        schedule: Yup.array().of(
            Yup.object().shape({
                air_temperature: Yup.number()
                    .min(1, "Minimalna wartość to 0")
                    .max(100, "Maksymalna wartość to 100")
                    .typeError('Wartość musi być liczbą')
                    .required("Pole jest wymagane"),
                air_humidity:Yup.number()
                    .min(1, "Minimalna wartość to 0")
                    .max(100, "Maksymalna wartość to 100")
                    .typeError('Wartość musi być liczbą')
                    .required("Pole jest wymagane"),
                soil_humidity: Yup.number()
                    .min(1, "Minimalna wartość to 1")
                    .typeError('Wartość musi być liczbą')
                    .required("Pole jest wymagane"),
                duration: Yup.number()
                    .min(1, "Minimalna wartość to 0")
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
            })
        )
    });

    return (
        <div id={'plans'}>
            <Banner title={'Plany'}/>
            <div className={'container'}>
                <ManualPlan/>
                <div className={'title mt-3 mb-3'}>
                            <span>
                            <h4 style={{display: 'inline-block'}}>Zapisane plany</h4>
                            </span>
                    <button type="button" className="btn btn-sm btn-primary" style={{width: "12em"}} onClick={() => {
                        setModalVisibility(true)
                    }}>Stwórz plan
                    </button>
                </div>
                <div className="accordion accordion-flush">
                    <CreatePlan reload={reload}/>
                </div>
                <History/>
            </div>
            <Modal
                show={modalVisibility}
                onHide={() => setModalVisibility(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Stwórz nowy plan
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            name: '',
                            schedule: [{
                                air_temperature: null,
                                air_humidity: null,
                                soil_humidity: null,
                                duration: null,
                                light: {
                                    start_hour: '8:00',
                                    end_hour: '18:00',
                                    minimumLevel: null,
                                },
                            }],
                        }}
                        validationSchema={validate}
                        onSubmit={(values, {resetForm}) => {
                            updatePlan({
                                variables: {
                                    name: values.name,
                                    schedule: values.schedule,
                                }
                            }).then(() => {
                                setReload(!reload)
                                setModalVisibility(false)
                            })
                        }}
                    >
                        {({errors, values, touched, setValues}) => (
                            <Form>
                                <label className="form-label">Nazwa planu</label>
                                <Field id={"name"} name={"name"} type="text"
                                       className="form-control mb-1" placeholder="Nazwa"
                                />
                                <ErrorMessage name="name"
                                              render={msg => <div className={'form-error'}>{msg}</div>}/>
                                <hr/>
                                <FieldArray name="schedule">
                                    {() => (values.schedule.map((ticket, i) => {
                                        const scheduleErrors = errors.schedule?.length && errors.schedule[i] || {};
                                        const scheduleTouched = touched.schedule?.length && touched.schedule[i] || {};
                                        return (
                                            <div key={i} className={'row'}>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Temperatura powietrza</label>
                                                    <Field name={`schedule.${i}.air_temperature`} className={'w-100'}
                                                           type={'number'}></Field>
                                                    <ErrorMessage name={`schedule.${i}.air_temperature`}
                                                                  render={msg => <div
                                                                      className={'form-error'}>{msg}</div>}/>
                                                </div>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Wilgotność powietrza</label>
                                                    <Field name={`schedule.${i}.air_humidity`} className={'w-100'}
                                                           type={'number'}></Field>
                                                    <ErrorMessage name={`schedule.${i}.air_humidity`}
                                                                  render={msg => <div
                                                                      className={'form-error'}>{msg}</div>}/>
                                                </div>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Wilgotność gleby</label>
                                                    <Field name={`schedule.${i}.soil_humidity`} className={'w-100'}
                                                           type={'number'}></Field>
                                                    <ErrorMessage name={`schedule.${i}.soil_humidity`}
                                                                  render={msg => <div
                                                                      className={'form-error'}>{msg}</div>}/>
                                                </div>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Godziny doświetlania</label>
                                                    <Field name={`schedule.${i}.light`}>
                                                        {({field, form, meta}) => {
                                                            const setupTimeCallback = (start, end) => {
                                                                field.value.start_hour = start
                                                                field.value.end_hour = end
                                                            }
                                                            return (<div>
                                                                <TimePicker {...field} start={field.value.start_hour}
                                                                            end={field.value.end_hour}
                                                                            setupTime={setupTimeCallback}/>
                                                            </div>)
                                                        }}
                                                    </Field>
                                                </div>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Minimalny poziom dośwetlania</label>
                                                    <Field name={`schedule.${i}.light.minimumLevel`} className={'w-100'}
                                                           type={'number'}></Field>
                                                    <ErrorMessage name={`schedule.${i}.light.minimumLevel`}
                                                                  render={msg => <div
                                                                      className={'form-error'}>{msg}</div>}/>
                                                </div>
                                                <div className={'col-md-4'}>
                                                    <label className="form-label">Czas trwania (dni)</label>
                                                    <Field name={`schedule.${i}.duration`} className={'w-100'}
                                                           type={'number'}></Field>
                                                    <ErrorMessage name={`schedule.${i}.air_temperature`}
                                                                  render={msg => <div
                                                                      className={'form-error'}>{msg}</div>}/>
                                                </div>
                                                <hr className={'mt-3'}/>
                                            </div>
                                        );
                                    }))}
                                </FieldArray>
                                <div className={'row pt-3'}>
                                    <div className={'col-md-6'}>
                                        <Field name="fieldAdd">
                                            {({field}) => (
                                                <button type="button" className="btn btn-sm btn-primary"
                                                        onClick={(e) => addEmptyPlanItem(e, field, values, setValues)}>Dodaj
                                                </button>
                                            )}
                                        </Field>
                                    </div>
                                    <div className={'col-md-6'}>
                                        <Field name="fieldRemove">
                                            {({field}) => (
                                                <button type="button" className="btn btn-sm btn-danger"
                                                        onClick={(e) => removePlanItem(e, field, values, setValues)}>Usuń
                                                </button>
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-sm btn-primary mt-3">
                                    Zapisz
                                </button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Plans;
