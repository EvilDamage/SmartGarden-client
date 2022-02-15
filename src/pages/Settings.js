import {Button, Form, Spinner} from "react-bootstrap";
import {useMutation, useQuery} from "@apollo/client";
import {DELETE_USER, GET_SETTINGS, UPDATE_SETTINGS} from "../helpers/gqlQueries";
import Banner from "../components/Banner";
import React, {useEffect, useState} from "react";

const Settings = () => {
    const [pump, setPump] = useState(false);
    const [pumpFertilizer, setPumpFertilizer] = useState(false);
    const [light, setLight] = useState(false);
    const [fan, setFan] = useState(false);
    const [mode, setMode] = useState(false);
    const [interval, setInterval] = useState(false);

    const {data, loading, error} = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);

    useEffect(() => {
        if (data) {
            setPump(data.settings.pump)
            setPumpFertilizer(data.settings.pump_fertilizer)
            setLight(data.settings.light)
            setFan(data.settings.fan)
            setInterval(data.settings.interval)
            setMode(data.settings.mode)
        }
    }, [data])

    return (
        <>
            <Banner title={'Ustawienia'}/>
            <div className={'container mt-3'}>
                {loading &&
                <div className={'mt-3'} style={{textAlign: 'center'}}>
                    <Spinner animation="border" variant="primary" className={'spinner'} style={{height: '6em', width: '6em'}}/>
                    <p>Ładowanie</p>
                </div>
                }
                {data &&
                <>
                    <Form>
                        <label className="form-label">Tryb pracy</label>
                        <Form.Select className={'w-25'} value={mode} onChange={(e) => setMode(e.target.value)}>
                            <option value="manual">Manual</option>
                            <option value="plan">Plan</option>
                            <option value="off">Off</option>
                        </Form.Select>
                        <label className="form-label mt-3">Interwał odczytów (min)</label>
                        <Form.Select className={'w-25'} value={interval} onChange={(e) => setInterval(e.target.value)}>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="60">60</option>
                            <option value="120">120</option>
                        </Form.Select>
                        <div className={'mt-3'}>
                            <Form.Check
                                type="switch"
                                checked={pump}
                                onClick={() => setPump(!pump)}
                                label="Dozowanie wody"
                            />
                            <Form.Check
                                type="switch"
                                checked={pumpFertilizer}
                                onClick={() => setPumpFertilizer(!pumpFertilizer)}
                                label="Dozowanie nawozu"
                            />
                            <Form.Check
                                type="switch"
                                checked={light}
                                onClick={() => setLight(!light)}
                                label="Oświetlenie"
                            />
                            <Form.Check
                                type="switch"
                                checked={fan}
                                onClick={() => setFan(!fan)}
                                label="Wentylacja"
                            />
                        </div>
                        <button type="button" className="btn btn-primary w-25 mt-3"
                                onClick={() => {
                                    updateSettings({
                                        variables: {
                                            mode: mode,
                                            interval: parseInt(interval),
                                            pump: pump,
                                            pump_fertilizer: pumpFertilizer,
                                            light: light,
                                            fan: fan
                                        }
                                    })
                                }}>
                            {!loadingUpdateSettings ? 'Zapisz' :
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </button>
                    </Form>
                </>
                }

            </div>
        </>
    )
}

export default Settings;
