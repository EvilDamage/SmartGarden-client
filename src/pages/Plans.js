import Banner from "../components/Banner";
import {useMutation, useQuery} from "@apollo/client";
import {
    ADD_PLANS,
    CURRENT_SENSOR_READS,
    DELETE_PLAN,
    GET_PLANS,
    GET_SETTINGS,
    UPDATE_SETTINGS
} from "../helpers/gqlQueries";
import {FiUserMinus} from "react-icons/fi";
import React, {useEffect, useState} from "react";
import {BsFillLightbulbFill, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";
import {formatDateForDisplay} from "../helpers/dataParse";
import {Form, Modal} from "react-bootstrap";

const Plans = () => {
    const [modalVisibility, setModalVisibility] = useState(false)

    const [planName, setPlanName] = useState('')
    const [createList, setCreateList] = useState([])

    const {data, loading, error, refetch} = useQuery(GET_PLANS);
    const [updatePlan, {loading: loadingUpdatePlan, error: ErrorUpdatePlan}] = useMutation(ADD_PLANS);
    const [deletePlan, {loading: loadingDeletePlan, error: ErrorDeletePlan}] = useMutation(DELETE_PLAN);

    const {data: settings, loading: settingsLoading, error: settingsError, refetch: settingsRefeatch} = useQuery(GET_SETTINGS);
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
                start_hour: '10:00',
                end_hour: '12:00',
                minimumLevel: 50,
            },
        }])
    }

    return (
        <div id={'plans'}>
            <Banner title={'Plany'}/>
            <div className={'container'}>
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
                                                }).then(()=>{
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
                                                <button type="button" className="btn btn-sm btn-primary">Edytuj</button>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={()=> deletePlan({variables: {id: plan.id}}).then(()=> refetch())}>Usuń</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
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
                                        <div className={'col-4'}>
                                            <label className="form-label">Temperatura</label>
                                            <input type="text" className="form-control" placeholder="24"
                                                   value={planTemplate.air_temperature}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].air_temperature = parseInt(e.target.value)
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                        <div className={'col-4'}>
                                            <label className="form-label">Wilgotność powietrza</label>
                                            <input type="text" className="form-control" placeholder="65"
                                                   value={planTemplate.air_humidity}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].air_humidity = parseInt(e.target.value)
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                        <div className={'col-4'}>
                                            <label className="form-label">Wilgotność gleby</label>
                                            <input type="text" className="form-control" placeholder="65"
                                                   value={planTemplate.soil_humidity}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].soil_humidity = parseInt(e.target.value)
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-4'}>
                                            <label className="form-label">Godzina rozpoczęcia</label>
                                            <input type="text" className="form-control" placeholder="8:00"
                                                   value={planTemplate.light.start_hour}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].light.start_hour = e.target.value
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                        <div className={'col-4'}>
                                            <label className="form-label">Godzina zakończenia</label>
                                            <input type="text" className="form-control" placeholder="20:00"
                                                   value={planTemplate.light.end_hour}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].light.end_hour = e.target.value
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                        <div className={'col-4'}>
                                            <label className="form-label">Minimalny poziom oświetlenia</label>
                                            <input type="text" className="form-control" placeholder="50"
                                                   value={planTemplate.light.minimumLevel}
                                                   onChange={(e) => {
                                                       let createListTemp = createList
                                                       createListTemp[index].light.minimumLevel = parseInt(e.target.value)
                                                       setCreateList([...createListTemp])
                                                   }}/>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-4'}>
                                            <label className="form-label">Czas trwania</label>
                                            <input type="text" className="form-control" placeholder="7"
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
                    <button type="button" className="btn btn-sm btn-primary mt-3"
                            onClick={() => addEmptyPlanItem()}>Dodaj
                    </button>
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
                                }).then(()=>{
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
