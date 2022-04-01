import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {HISTORY} from "../helpers/gqlQueries";
import {formatDateForDisplay} from "../helpers/dataParse";
import {Spinner} from "react-bootstrap";

const History = () => {
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [historyData, setHistoryData] = useState(0)

    const {data, loading} = useQuery(HISTORY, {variables: {limit: limit, offset: offset}})

    useEffect(() => {
        if (data) {
            setHistoryData(data)
        }
    }, [data])

    const generatePagination = (totalItems, offset, limit) => {
        const totalPages = parseInt((totalItems / limit) + 1);
        const actualPage = (offset / limit) + 1;

        let pages;

        if (totalPages >= 3) {
            if (actualPage == 1) {
                pages = (
                    <>
                        <li className="page-item active"><span className="page-link">1</span></li>
                        <li className="page-item" onClick={() => {
                            if (historyData.history.hasMore) {
                                setOffset(offset + limit)
                            }
                        }}><span className="page-link">2</span></li>
                        <li className="page-item" onClick={() => {
                            if (historyData.history.hasMore) {
                                setOffset(offset + (2 * limit))
                            }
                        }}><span className="page-link">3</span></li>
                    </>
                )
            } else if (actualPage === totalPages) {
                pages = (
                    <>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - (2 * limit))
                            }
                        }}><span className="page-link">{totalPages - 2}</span></li>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - limit)
                            }
                        }}><span className="page-link">{totalPages - 1}</span></li>
                        <li className="page-item active"><span className="page-link">{totalPages}</span></li>
                    </>
                )
            } else {
                pages = (
                    <>
                        <li className="page-item" onClick={() => {
                            if (offset > 0) {
                                setOffset(offset - limit)
                            }
                        }}><span className="page-link">{actualPage - 1}</span></li>
                        <li className="page-item active"><span className="page-link">{actualPage}</span></li>
                        <li className="page-item" onClick={() => {
                            if (historyData.history.hasMore) {
                                setOffset(offset + limit)
                            }
                        }}><span className="page-link">{actualPage + 1}</span></li>
                    </>
                )
            }
        }

        return (<nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={offset == 0 ? 'page-item disabled' : 'page-item'} onClick={() => {
                    if (offset > 0) {
                        setOffset(offset - limit)
                    }
                }}><span className="page-link">Poprzednia</span></li>
                {pages}
                <li className={!historyData.history.hasMore ? 'page-item disabled' : 'page-item'} onClick={() => {
                    if (historyData.history.hasMore) {
                        setOffset(offset + limit)
                    }
                }}><span className="page-link">Następna</span></li>
            </ul>
        </nav>)
    }

    return (
        <>
            <div className={'title mt-3'}>
                        <span>
                            <h4 style={{display: 'inline-block'}}>Historia</h4>
                        </span>
            </div>
            {historyData ?
            <div className={'table-responsive'}>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">Index</th>
                        <th scope="col">Komentarz</th>
                        <th scope="col">Data</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historyData.history.history.map((historyItem, index) => {
                        return (
                            <tr key={index}>
                                <td>{historyItem.id}</td>
                                <td>{historyItem.comment}</td>
                                <td>{formatDateForDisplay(historyItem.created_at)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {generatePagination(historyData.history.totalLength, offset, limit)}
            </div>
            :
                <div>Brak wyników</div>
            }
        </>
    )
}

export default History;
