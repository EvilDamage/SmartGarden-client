import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {CURRENT_SENSOR_READS} from "../helpers/gqlQueries";
import {CircularProgressbar, CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {IoReload} from 'react-icons/io5'
import {formatDateForDisplay} from "../helpers/dataParse";
import Banner from "../components/Banner";


const Home = () => {
    const {data, loading, error, refetch} = useQuery(CURRENT_SENSOR_READS, {notifyOnNetworkStatusChange: true});

    return (
        <>
            <Banner title={'Dashboard'}/>
            <Container id={'home'} className={'mt-3'}>
                <div className={'title'}>
                <span>
                    <h4 style={{display: 'inline-block'}}>Ostatni odczyt</h4>
                    <small className={'text-muted'} style={{marginLeft: '1em'}}>
                        {data && formatDateForDisplay(data && data.currentSensorsReading.created_at)}
                    </small>
                </span>

                    <div className={loading ? 'refeach disabled' : 'refeach'} onClick={() => !loading && refetch()}>
                        <IoReload/></div>
                </div>
                <Row>
                    <Col lg={2} md={3} className={'mt-2'}>
                        <Card body className={'info-card'}>
                            {!loading ?
                                <div className={'progress-circle'}>
                                    <CircularProgressbar
                                        value={data && data.currentSensorsReading.air_temperature}
                                        text={`${data && data.currentSensorsReading.air_temperature}°C`}/>
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
                                        value={data && data.currentSensorsReading.air_humidity}
                                        text={`${data && data.currentSensorsReading.air_humidity}%`}/>
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
                                        value={data && data.currentSensorsReading.air_pressure}>
                                <span style={{fontSize: '18px', color: '#064635'}}>
                                    {data && data.currentSensorsReading.air_pressure}<br/>hPa
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
                                        value={data && data.currentSensorsReading.soil_humidity}
                                        text={`${data && data.currentSensorsReading.soil_humidity}%`}/>
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
                                        value={data && data.currentSensorsReading.light_level}
                                        text={`${data && data.currentSensorsReading.light_level}%`}/>
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
                                        className={data && data.currentSensorsReading.cpu_temperature > 50 && 'progress-circle-danger'}
                                        maxValue={80} value={data && data.currentSensorsReading.cpu_temperature}
                                        text={`${data && data.currentSensorsReading.cpu_temperature.toFixed(2)}°C`}/>
                                </div>
                                :
                                <Spinner animation="border" variant="primary" className={'spinner'}/>
                            }
                            <div className={'label mt-2'}>Temperatura procesora</div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home;
