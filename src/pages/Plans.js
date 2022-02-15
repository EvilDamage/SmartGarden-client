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

import {Formik, Field, Form} from 'formik';

const Plans = () => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [planName, setPlanName] = useState('')
    const [createList, setCreateList] = useState([])

    // const [manualPlan, setManualPlan] = useState({
    //     air_temperature: null,
    //     air_humidity: null,
    //     soil_humidity: null,
    //     light: {
    //         start_hour: null,
    //         end_hour: null,
    //         minimumLevel: null,
    //     }
    // })

    const {data, loading, error, refetch} = useQuery(GET_PLANS);
    const [updatePlan, {loading: loadingUpdatePlan, error: ErrorUpdatePlan}] = useMutation(ADD_PLANS);
    const {data: manualPlanData, loading: loadingManualPlan, error: ErrorManualPlan} = useQuery(MANUAL_PLAN);
    const [updateManualPlan, {
        loading: loadingUpdateManualPlan,
        error: ErrorUpdateManualPlan
    }] = useMutation(ADD_MANUAL_PLAN);
    const [deletePlan, {loading: loadingDeletePlan, error: ErrorDeletePlan}] = useMutation(DELETE_PLAN);
    const {
        data: settings,
        loading: settingsLoading,
        error: settingsError,
        refetch: settingsRefeatch
    } = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);

    useEffect(() => {
        addEmptyPlanItem()
    }, [])

    const addEmptyPlanItem = () => {
        setCreateList([...createList, {
            air_temperature: null,
            air_humidity: null,
            soil_humidity: null,
            duration: null,
            light: {
                start_hour: '8:00',
                end_hour: '18:00',
                minimumLevel: null,
            },
        }])
    }

    const removePlanItem = () => {
        setCreateList(createList.slice(0, -1))
    }

    return (
        <div id={'plans'}>
            <Banner title={'Plany'}/>
            <div className={'container'}>
                <div className={'title mt-3 mb-3'}>
                    <span>
                        <h4 style={{display: 'inline-block'}}>Dane manualne</h4>
                    </span>
                </div>
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
                    onSubmit={(values) => {
                        updateManualPlan({
                            variables: {
                                air_humidity: values.air_humidity,
                                soil_humidity: values.soil_humidity,
                                air_temperature: values.air_temperature,
                                light: values.light
                            }
                        })
                    }}
                >
                    <Form>
                        <div className={'row'}>
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <Field id={"air_temperature"} name={"air_temperature"} type="number"
                                       className="form-control" placeholder="Temperatura"
                                />
                            </div>
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <Field id={"air_humidity"} name={"air_humidity"} type="number"
                                       className="form-control" placeholder="Wilgotność"
                                />
                            </div>
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <Field id={"soil_humidity"} name={"soil_humidity"} type="number"
                                       className="form-control" placeholder="Wilgotność gleby"
                                />
                            </div>
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <Field name={'light'}>
                                    {({ field, form, meta }) => {
                                        const setupTimeCallback = (start, end) =>{
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
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <Field id={"light.minimumLevel"} name={"light.minimumLevel"} type="number"
                                       className="form-control" placeholder="Poziom oświetlenia"
                                />
                            </div>
                            <div className={'col-md-4 col-lg-2 mb-1'}>
                                <button type="submit" className="btn btn-primary" disabled={loadingUpdateManualPlan}>
                                    {!loadingUpdateManualPlan ? 'Zapisz' : <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}
                                </button>
                            </div>
                        </div>
                    </Form>
                </Formik>
                }
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
                    {
                        data && data.profiles.map((plan, index) => {
                            return (
                                <div key={index} className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingOne">
                                        <BootstrapForm.Check
                                            style={{position: 'absolute', zIndex: 100, marginLeft: 15}}
                                            type="radio"
                                            checked={settings && settings.settings.current_plan === plan.id}
                                            onChange={() => {
                                                updateSettings({
                                                    variables: {
                                                        current_plan: plan.id
                                                    }
                                                }).then(() => {
                                                    settingsRefeatch()
                                                })
                                            }}
                                        />
                                        <button className="accordion-button collapsed button-title" type="button"
                                                style={{paddingLeft: 65}}
                                                data-bs-toggle="collapse" data-bs-target={'#index' + index}
                                                aria-expanded="false" aria-controls="flush-collapseTwo">
                                            {plan.name}
                                        </button>
                                    </h2>
                                    <div id={'index' + index} className="accordion-collapse collapse"
                                         aria-labelledby="headingOne"
                                         data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <ul className="list-group">
                                                {
                                                    plan.schedule.map((schedule, index) => {
                                                        return (
                                                            <li key={index}
                                                                className="list-group-item d-flex justify-content-between align-items-start">
                            <span>
                            <FaTemperatureHigh/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.air_temperature}</span>
                            <WiHumidity/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.air_humidity}%</span>
                            <GiPlantRoots/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.soil_humidity}%</span>
                            <BsFillLightbulbFill/><span style={{
                                marginLeft: '0.5em',
                                marginRight: '1em'
                            }}>{schedule.light.start_hour}-{schedule.light.end_hour}</span>

                            </span>
                                                                <span
                                                                    className="small">{schedule.duration} dni</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                            <div className={'button-wrapper mt-3'}>
                                                <button type="button" className="btn btn-sm btn-danger"
                                                        onClick={() => deletePlan({variables: {id: plan.id}}).then(() => refetch())}>Usuń
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
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
                    <div className={'container'}>
                        <label className="form-label">Nazwa</label>
                        <input type="text" className="form-control" placeholder="Marchewka"
                               onChange={(e) => setPlanName(e.target.value)}/>
                        <hr/>
                    </div>
                    {
                        createList.map((planTemplate, index) => {
                            return (
                                <div key={index}>
                                    <div className={'row'}>
                                        <div className={'col-md-4'}>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"
                                                          style={{height: 50, width: 50}}><FaTemperatureHigh/></span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="Temperatura"
                                                       value={planTemplate.air_temperature}
                                                       onChange={(e) => {
                                                           let createListTemp = createList
                                                           createListTemp[index].air_temperature = parseInt(e.target.value)
                                                           setCreateList([...createListTemp])
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className={'col-md-4'}>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{
                                                        height: 50,
                                                        width: 50,
                                                        fontSize: 24
                                                    }}><WiHumidity/></span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="Wilgotność"
                                                       value={planTemplate.air_humidity}
                                                       onChange={(e) => {
                                                           let createListTemp = createList
                                                           createListTemp[index].air_humidity = parseInt(e.target.value)
                                                           setCreateList([...createListTemp])
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className={'col-md-4'}>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"
                                                          style={{height: 50, width: 50}}><GiPlantRoots/></span>
                                                </div>
                                                <input type="text" className="form-control"
                                                       placeholder="Wilgotność gleby"
                                                       value={planTemplate.soil_humidity}
                                                       onChange={(e) => {
                                                           let createListTemp = createList
                                                           createListTemp[index].soil_humidity = parseInt(e.target.value)
                                                           setCreateList([...createListTemp])
                                                       }}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-md-4'}>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{
                                                        height: 50,
                                                        width: 50,
                                                    }}><BsFillLightbulbFill/></span>
                                                </div>
                                                <input type="text" className="form-control"
                                                       placeholder="Poziom oświetlenia"
                                                       value={planTemplate.light.minimumLevel}
                                                       onChange={(e) => {
                                                           let createListTemp = createList
                                                           createListTemp[index].light.minimumLevel = parseInt(e.target.value)
                                                           setCreateList([...createListTemp])
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className={'col-md-4'}>
                                            <TimePicker start={'8:00'} end={'19:00'} index={index}
                                                        setCreateList={setCreateList} createList={createList}/>
                                        </div>
                                        <div className={'col-md-4'}>
                                            <input type="text" className="form-control" placeholder="Czas trwania (dni)"
                                                   value={planTemplate.duration}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].duration = parseInt(e.target.value)
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                    </div>
                                    <hr className={'mt-3'}/>
                                </div>
                            )
                        })
                    }
                    <div className={'row'}>
                        <div className={'col-md-6'}>
                            <button type="button" className="btn btn-sm btn-primary"
                                    onClick={() => addEmptyPlanItem()}>Dodaj
                            </button>
                        </div>
                        <div className={'col-md-6'}>
                            <button type="button" className="btn btn-sm btn-danger"
                                    onClick={() => removePlanItem()}>Usuń
                            </button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-sm btn-primary mt-3"
                            onClick={() => {
                                // console.log(planName, createList)
                                updatePlan({
                                    variables: {
                                        name: planName,
                                        schedule: createList,
                                    }
                                }).then(() => {
                                    refetch()
                                    setModalVisibility(false)
                                    setCreateList([])
                                    addEmptyPlanItem()
                                })
                            }}>Zapisz
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Plans;
