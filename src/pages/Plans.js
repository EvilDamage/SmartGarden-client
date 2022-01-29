import Banner from "../components/Banner";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_MANUAL_PLAN,
    ADD_PLANS,
    CURRENT_SENSOR_READS,
    DELETE_PLAN,
    GET_PLANS,
    GET_SETTINGS, HISTORY,
    UPDATE_SETTINGS
} from "../helpers/gqlQueries";
import {FiUserMinus} from "react-icons/fi";
import React, {useEffect, useState} from "react";
import {BsFillLightbulbFill, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";
import {formatDateForDisplay} from "../helpers/dataParse";
import {Form, Modal} from "react-bootstrap";
import TimePicker from "../components/TimePicker";

const Plans = () => {
    const [modalVisibility, setModalVisibility] = useState(false)
    const [planName, setPlanName] = useState('')
    const [createList, setCreateList] = useState([])

    const [manualPlan, setManualPlan] = useState({
        air_temperature: null,
        air_humidity: null,
        soil_humidity: null,
        duration: null,
        light: {
            start_hour: '8:00',
            end_hour: '18:00',
            minimumLevel: null,
        }
    })

    const {data: historyData} = useQuery(HISTORY)
    const {data, loading, error, refetch} = useQuery(GET_PLANS);
    const [updatePlan, {loading: loadingUpdatePlan, error: ErrorUpdatePlan}] = useMutation(ADD_PLANS);
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
                <div className={'row'}>
                    <div className={'col-md-2 mb-1'}>
                        <input type="text" className="form-control" placeholder="Temperatura" onChange={(e) => {
                            let userManualPlan = manualPlan
                            userManualPlan.air_temperature = parseInt(e.target.value)
                            setManualPlan(userManualPlan)
                        }}/>
                    </div>
                    <div className={'col-md-2 mb-1'}>
                        <input type="text" className="form-control" placeholder="Wilgotność" onChange={(e) => {
                            let userManualPlan = manualPlan
                            userManualPlan.air_humidity = parseInt(e.target.value)
                            setManualPlan(userManualPlan)
                        }}/>
                    </div>
                    <div className={'col-md-2 mb-1'}>
                        <input type="text" className="form-control" placeholder="Wilgotność gleby" onChange={(e) => {
                            let userManualPlan = manualPlan
                            userManualPlan.soil_humidity = parseInt(e.target.value)
                            setManualPlan(userManualPlan)
                        }}/>
                    </div>
                    <div className={'col-md-2 mb-1'}>
                        <TimePicker start={'8:00'} end={'19:00'}/>
                    </div>
                    <div className={'col-md-2 mb-1'}>
                        <input type="text" className="form-control" placeholder="Poziom oświetlenia" onChange={(e) => {
                            let userManualPlan = manualPlan
                            userManualPlan.light.minimumLevel = parseInt(e.target.value)
                            setManualPlan(userManualPlan)
                        }}/>
                    </div>
                    <div className={'col-md-2 mb-1'}>
                        <button type="button" className="btn btn-primary" onClick={() => {
                            updateManualPlan({
                                variables: {
                                    air_humidity: manualPlan.soil_humidity,
                                    soil_humidity: manualPlan.soil_humidity,
                                    air_temperature: manualPlan.air_temperature,
                                    light: manualPlan.light
                                }
                            })
                        }}>
                            Zapisz
                        </button>
                    </div>
                </div>
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
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingOne">
                                        <Form.Check
                                            style={{position: 'absolute', zIndex: 100, marginLeft: 15}}
                                            type="radio"
                                            checked={settings && settings.settings[0].current_plan === plan.id}
                                            onClick={() => {
                                                console.log('asdasd')
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
                                                    plan.schedule.map((schedule) => {
                                                        return (
                                                            <li className="list-group-item d-flex justify-content-between align-items-start">
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
                <div className={'title mt-3 mb-3'}>
                            <span>
                            <h4 style={{display: 'inline-block'}}>Historia</h4>
                            </span>
                </div>
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
                                <>
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
                                </>
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
