import React, {useEffect, useState} from "react";
import {AiOutlineClockCircle, BsCheck2, GrCheckmark, MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/all";

const NumberPicker = (props) => {
    const [number, setNumber] = useState(props.type ? parseInt(props.number.split(':')[1]) : parseInt(props.number.split(':')[0]))

    const timeParse = (operation) =>{
        if(operation === 'add'){
            if(props.type === 'mins'){
                let newNumber = number + 1
                if (newNumber > 59) {
                    newNumber = 0;
                }
                return props.number.split(':')[0] + ":" + (newNumber < 10 ? '0' + newNumber : newNumber)
            }else{
                let newNumber = number + 1
                if (newNumber > 23) {
                    newNumber = 0;
                }
                return (newNumber < 10 ? '0' + newNumber : newNumber) + ':' + props.number.split(':')[1]
            }
        }else{
            if(props.type === 'mins'){
                let newNumber = number - 1
                if (newNumber < 0) {
                    newNumber = 59;
                }
                return props.number.split(':')[0] + ":" + (newNumber < 10 ? '0' + newNumber : newNumber)
            }else{
                let newNumber = number - 1
                if (newNumber < 0) {
                    newNumber = 23;
                }
                return (newNumber < 10 ? '0' + newNumber : newNumber) + ':' + props.number.split(':')[1]
            }
        }

    }

    const addNumber = () => {
        if (props.type === 'mins') {
            if (number < 59) {
                setNumber(number + 1)
            } else {
                setNumber(0)
            }
            props.setDate(timeParse('add'))
        } else {
            if (number < 23) {
                setNumber(number + 1)
            } else {
                setNumber(0)
            }
            props.setDate(timeParse('add'))
        }
    }

    const subtractNumber = () => {
        if (props.type === 'mins') {
            if (number > 0) {
                setNumber(number - 1)
            } else {
                setNumber(59)
            }
            props.setDate(timeParse('subtract'))
        } else {
            if (number > 0) {
                setNumber(number - 1)
            } else {
                setNumber(23)
            }
            props.setDate(timeParse('subtract'))
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: 'center'}} className={'noselect'}>
            <MdKeyboardArrowUp onClick={() => {
                addNumber()
            }}/>
            <div className={'noselect'}>{number < 10 ? '0' + number : number}</div>
            <MdKeyboardArrowDown onClick={() => {
                subtractNumber()
            }}/>
        </div>
    )
}

const TimePicker = ({start, end, index, createList,  setCreateList}) => {
    const [startDate, setStartDate] = useState(start)
    const [endDate, setEndDate] = useState(end)
    const [pickerVisibility, setPickerVisibility] = useState(false)

    useEffect(()=>{
        if(index && createList && setCreateList){
            let createListTemp = createList
            createListTemp[index].light.start_hour = startDate
            createListTemp[index].light.end_hour = endDate

            setCreateList([...createListTemp])
        }
    }, [startDate, endDate])

    return (
        <div id={'timePicker'}>
            <div className={'picker-label'} onClick={() => {
                setPickerVisibility(!pickerVisibility)
            }}>
                {startDate} - {endDate} <AiOutlineClockCircle className={'clock-icon'}/>
            </div>
            {pickerVisibility &&
            <div className={'time-pick'}>
                <NumberPicker number={startDate} setDate={setStartDate}/>
                :
                <NumberPicker number={startDate} setDate={setStartDate} type={'mins'}/>
                -
                <NumberPicker number={endDate} setDate={setEndDate}/>
                :
                <NumberPicker number={endDate} setDate={setEndDate} type={'mins'}/>
                <button onClick={()=>{setPickerVisibility(false)}} className={'btn btn-primary save'}><BsCheck2/></button>
            </div>
            }
        </div>
    )

}

export default TimePicker;
