import {Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {GET_PLAN, GET_PLANS, GET_SETTINGS, LAST_SENSOR_READS, MANUAL_PLAN} from "../helpers/gqlQueries";
import {CircularProgressbar, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {IoReload} from 'react-icons/io5'
import {calculateDaysBetween, formatDateForDisplay} from "../helpers/dataParse";
import Banner from "../components/Banner";
import {BsFillLightbulbFill, BsFillPencilFill, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";
import React, {useEffect, useState} from "react";
import History from "../components/History";


const Home = () => {
    const [totalPlanDuration, setTotalPlanDuration] = useState(0)
    const [planProgress, setPlanProgress] = useState(0)

    const {data, loading, error, refetch} = useQuery(LAST_SENSOR_READS, {notifyOnNetworkStatusChange: true});
    const {data: settings, loading: settingsLoading, error: settingsError} = useQuery(GET_SETTINGS);
    const {data: plansData, loading: planLoading, error: plansError} = useQuery(GET_PLAN, {
        variables: {id: settings && settings.settings.current_plan}
    });
    const {data: manualPlanData, loading: loadingManualPlan, error: ErrorManualPlan} = useQuery(MANUAL_PLAN);

    useEffect(() => {
        let totalDuration = 0;
        plansData && plansData.profile[0].schedule.map((schedule) => {
            totalDuration += schedule.duration
        })

        setTotalPlanDuration(totalDuration)
        setPlanProgress(calculateDaysBetween(new Date(), plansData && plansData.profile[0].started_at))

    }, [plansData])


    return (
        <>
            <Banner title={'Dashboard'}/>
            <div id={'home'} className={'container mt-3'}>
                <div className={'title'}>
                    <span>
                        <h4 style={{display: 'inline-block'}}>Ostatni odczyt</h4>
                        <small className={'text-muted'} style={{marginLeft: '1em'}}>
                            {data && formatDateForDisplay(data && data.lastSensorsReading.created_at)}
                        </small>
                    </span>
                    <div className={loading ? 'refeach disabled' : 'refeach'} onClick={() => !loading && refetch()}>
                        <IoReload/>
                    </div>
                </div>
                <Row>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        value={data && data.lastSensorsReading.air_temperature}
                                        text={`${data && data.lastSensorsReading.air_temperature}°C`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Temperatura powietrza</div>
                        </Card>
                    </Col>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        value={data && data.lastSensorsReading.air_humidity}
                                        text={`${data && data.lastSensorsReading.air_humidity.toFixed(2)}%`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Wilgotność powietrza</div>
                        </Card>
                    </Col>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbarWithChildren
                                        maxValue={1500}
                                        value={data && data.lastSensorsReading.air_pressure}>
                                <span style={{fontSize: '12px', color: '#064635'}}>
                                    {data && data.lastSensorsReading.air_pressure}<br/>hPa
                                </span>
                                    </CircularProgressbarWithChildren>
                                </div>

                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Ciśnienie atmosferyczne</div>
                        </Card>
                    </Col>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        value={data && data.lastSensorsReading.soil_humidity}
                                        text={`${data && data.lastSensorsReading.soil_humidity}%`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Wilgotność gleby</div>
                        </Card>
                    </Col>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        value={data && data.lastSensorsReading.light_level}
                                        text={`${data && data.lastSensorsReading.light_level}%`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Poziom oświetlenia</div>
                        </Card>
                    </Col>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        className={data && data.lastSensorsReading.cpu_temperature > 50 && 'progress-circle-danger'}
                                        maxValue={80} value={data && data.lastSensorsReading.cpu_temperature}
                                        text={`${data && data.lastSensorsReading.cpu_temperature.toFixed(2)}°C`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Temperatura procesora</div>
                        </Card>
                    </Col>
                </Row>
                <div className={'title mt-3 w-100'}>
                    <div className={'w-100'}>
                        <div className={'title mb-3'}>
                            <h4 style={{display: 'inline-block'}}>Wybrany plan</h4>
                            <a href={'/plans'} className={'refeach'}>
                                <BsFillPencilFill/>
                            </a>
                        </div>
                        {
                            settings && settings.settings.mode === "off" &&
                            <div>
                                System wyłączony
                            </div>
                        }
                        {
                            settings && settings.settings.mode === "manual" &&
                            <div>
                                <p className={'mt-3'}>System działa w trybie manualnym</p>
                                <Row>
                                    <Col lg={2} md={3} className={'mt-2'}>
                                        <Card body className={'info-card'}>
                                            {!loadingManualPlan ?
                                                <div className={'manual-parameters'}>
                                                    {manualPlanData && manualPlanData.manualProfile.air_temperature}°C
                                                </div>
                                                :
                                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                                            }
                                            <div className={'label mt-2'}>Zadana temperatura powietrza</div>
                                        </Card>
                                    </Col>
                                    <Col lg={2} md={3} className={'mt-2'}>
                                        <Card body className={'info-card'}>
                                            {!loadingManualPlan ?
                                                <div className={'manual-parameters'}>
                                                    {manualPlanData && manualPlanData.manualProfile.air_humidity}%
                                                </div>
                                                :
                                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                                            }
                                            <div className={'label mt-2'}>Zadana wilgotność powietrza</div>
                                        </Card>
                                    </Col>
                                    <Col lg={2} md={3} className={'mt-2'}>
                                        <Card body className={'info-card'}>
                                            {!loadingManualPlan ?
                                                <div className={'manual-parameters'}>
                                                    {manualPlanData && manualPlanData.manualProfile.soil_humidity}%
                                                </div>
                                                :
                                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                                            }
                                            <div className={'label mt-2'}>Zadana wilgotność gleby</div>
                                        </Card>
                                    </Col>
                                    <Col lg={2} md={3} className={'mt-2'}>
                                        <Card body className={'info-card'}>
                                            <div className={'label mt-2'}>Doświatlanie w godzinach:</div>
                                            {!loadingManualPlan ?
                                                <div className={'manual-parameters'}>
                                                    {manualPlanData && manualPlanData.manualProfile.light.start_hour}
                                                    -
                                                    {manualPlanData && manualPlanData.manualProfile.light.end_hour}
                                                </div>
                                                :
                                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                                            }
                                        </Card>
                                    </Col>
                                    <Col lg={2} md={3} className={'mt-2'}>
                                        <Card body className={'info-card'}>
                                            {!loadingManualPlan ?
                                                <div className={'manual-parameters'}>
                                                    {manualPlanData && manualPlanData.manualProfile.light.minimumLevel}%
                                                </div>
                                                :
                                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                                            }
                                            <div className={'label mt-2'}>Zadany minimalny poziom oświetlenia</div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        }
                        {
                            settings && !settings.settings.current_plan &&
                            <p>Nie wybrano planu</p>
                        }
                    </div>
                </div>
                {
                    settings && settings.settings.mode === "plan" &&
                    <div className="accordion-item w-100">
                        <h2 className="accordion-header" id="flush-headingOne">
                            <button className="accordion-button collapsed button-title" type="button"
                                    data-bs-toggle="collapse" data-bs-target={'#index'}
                                    aria-expanded="false" aria-controls="flush-collapseTwo">
                                {plansData && plansData.profile[0].name}
                                <div className="progress w-50" style={{marginLeft: '1em', marginRight: '0.2em'}}>
                                    <div className="progress-bar" role="progressbar"
                                         style={{width: (planProgress / totalPlanDuration * 100) + '%'}}
                                         aria-valuenow={planProgress}
                                         aria-valuemin="0" aria-valuemax={totalPlanDuration}>{planProgress} dni
                                    </div>
                                </div>
                                {totalPlanDuration} dni
                            </button>
                        </h2>
                        <div id={'index'} className="accordion-collapse collapse"
                             aria-labelledby="headingOne"
                             data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <ul className="list-group">
                                    {
                                        plansData && plansData.profile[0].schedule.map((schedule) => {
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
                            </div>
                        </div>
                    </div>
                }
                <History/>
            </div>
        </>
    )
}

export default Home;
