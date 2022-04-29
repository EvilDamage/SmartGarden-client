import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {DELETE_PLAN, GET_PLANS, GET_SETTINGS, GET_USER, UPDATE_SETTINGS} from "../helpers/gqlQueries";
import {Form as BootstrapForm, Toast, ToastContainer} from "react-bootstrap";
import {BsFillLightbulbFill, FaLeaf, FaTemperatureHigh, GiPlantRoots, WiHumidity} from "react-icons/all";
import {Pagination} from "react-pagination-bar"

const CreatePlan = ({reload}) => {
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [plansData, setPlansData] = useState(0)
    const [actualPage, setActualPage] = useState(1)

    const [showToast, setShowToast] = useState(false);
    const toggleShowToast = () => setShowToast(!showToast);

    const {data, loading, error, refetch} = useQuery(GET_PLANS, {
        variables: {limit: limit, offset: offset},
        fetchPolicy: "no-cache"
    });
    const [deletePlan, {loading: loadingDeletePlan, error: ErrorDeletePlan}] = useMutation(DELETE_PLAN);
    const {
        data: settings,
        loading: settingsLoading,
        error: settingsError,
        refetch: settingsRefeatch
    } = useQuery(GET_SETTINGS);
    const [updateSettings, {loading: loadingUpdateSettings, error: ErrorUpdateSettings}] = useMutation(UPDATE_SETTINGS);
    const {data: userData} = useQuery(GET_USER)

    useEffect(() => {
        if (data) {
            setPlansData(data)
        }
    }, [data])

    useEffect(() => {
        if (data) {
            refetch();
        }
    }, [reload])

    const generatePagination = (totalItems, offset, limit) => {
        const totalPages = Math.ceil(totalItems / limit);
        let pages;
        if (actualPage == 1) {
            pages = (
                <>
                    <li className="page-item active"><span className="page-link">1</span></li>
                    <li className={2 <= totalPages ? "page-item" : "page-item disabled"} onClick={() => {
                        if (plansData.profiles.hasMore && 2 <= totalPages) {
                            setOffset(offset + limit)
                            setActualPage(Math.ceil(offset / limit) + 2)
                        }
                    }}><span className="page-link">2</span></li>
                    <li className={3 <= totalPages ? "page-item" : "page-item disabled"} onClick={() => {
                        if (plansData.profiles.hasMore && 3 <= totalPages) {
                            setOffset(offset + (2 * limit))
                            setActualPage(Math.ceil(offset / limit) + 3)
                        }
                    }}><span className="page-link">3</span></li>
                </>
            )
        } else if (actualPage === 2 && actualPage === totalPages) {
            pages = (
                <>
                    <li className="page-item"><span className="page-link">1</span></li>
                    <li className={"page-item active"} onClick={() => {
                        if (plansData.profiles.hasMore && 2 <= totalPages) {
                            setOffset(offset + limit)
                            setActualPage(Math.ceil(offset / limit))
                        }
                    }}><span className="page-link">2</span></li>
                    <li className={3 <= totalPages ? "page-item" : "page-item disabled"} onClick={() => {
                        if (plansData.profiles.hasMore && 3 <= totalPages) {
                            setOffset(offset + (2 * limit))
                            setActualPage(Math.ceil(offset / limit) + 1)
                        }
                    }}><span className="page-link">3</span></li>
                </>
            )
        } else if (actualPage > 1 && actualPage < totalPages) {
            pages = (
                <>
                    <li className="page-item" onClick={() => {
                        if (offset > 0) {
                            setOffset(offset - limit)
                            setActualPage(Math.ceil(offset / limit))
                        }
                    }}><span className="page-link">{actualPage - 1}</span></li>
                    <li className="page-item active"><span className="page-link">{actualPage}</span></li>
                    <li className="page-item" onClick={() => {
                        if (plansData.profiles.hasMore) {
                            setOffset(offset + limit)
                            setActualPage(Math.ceil(offset / limit)+ 2)
                        }
                    }}><span className="page-link">{actualPage + 1}</span></li>
                </>
            )
        } else if (actualPage === totalPages) {
            pages = (
                <>
                    <li className="page-item" onClick={() => {
                        if (offset > 0) {
                            setOffset(offset - (2 * limit))
                            setActualPage(Math.ceil(offset / limit) - 1)
                        }
                    }}><span className="page-link">{totalPages - 2}</span></li>
                    <li className="page-item" onClick={() => {
                        if (offset > 0) {
                            setOffset(offset - limit)
                            setActualPage(Math.ceil(offset / limit))
                        }
                    }}><span className="page-link">{totalPages - 1}</span></li>
                    <li className="page-item active"><span className="page-link">{totalPages}</span></li>
                </>
            )
        }

        return (<nav aria-label="Page navigation example">
            <ul className="pagination">

                <li className={offset == 0 ? 'page-item disabled' : 'page-item'} onClick={() => {
                    if (offset > 0) {
                        setOffset(offset - limit)
                        setActualPage(Math.ceil(offset / limit))
                    }
                }}><span className="page-link">Poprzednia</span></li>
                {pages}
                <li className={!plansData.profiles.hasMore ? 'page-item disabled' : 'page-item'} onClick={() => {
                    if (plansData.profiles.hasMore) {
                        setOffset(offset + limit)
                        setActualPage(Math.ceil(offset / limit) + 2)
                    }
                }}><span className="page-link">Następna</span></li>
            </ul>
        </nav>)
    }

    return (
        <>
            {plansData && plansData.profiles.profiles.map((plan, index) => {
                return (<div key={index} className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <BootstrapForm.Check
                            style={{position: 'absolute', zIndex: 100, marginLeft: 15}}
                            type="radio"
                            checked={settings && settings.settings.current_plan === plan.id}
                            disabled={userData && userData.me.role !== 'ADMIN'}
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
                                <button type="button" className="btn btn-sm btn-danger" disabled={userData && userData.me.role !== 'ADMIN'}
                                        onClick={() => deletePlan({variables: {id: plan.id}}).then(() => {
                                            refetch();
                                            setShowToast(true)
                                            setTimeout(()=>{
                                                setShowToast(false)
                                            }, 3000)
                                        })}>Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)
            })
            }
            <div className={'mt-3'}>
                {plansData && generatePagination(plansData.profiles.totalLength, offset, limit)}
            </div>
            <ToastContainer className="p-3" position={'bottom-end'}>
                <Toast show={showToast} onClose={toggleShowToast}>
                    <Toast.Header>
                        <FaLeaf style={{color: '#064635', fontSize: '16px', marginRight: '5px'}}/>
                        <strong className="me-auto">Smart Garden</strong>
                        <small>3sec temu </small>
                    </Toast.Header>
                    <Toast.Body>Plan został usunięty!</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default CreatePlan;
