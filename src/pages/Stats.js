import {Container} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {SENSOR_READS} from "../helpers/gqlQueries";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {formatDateForDisplay} from "../helpers/dataParse";
import Banner from "../components/Banner";


const Stats = () => {
    const {data, loading, error, refetch} = useQuery(SENSOR_READS);

    // setInterval(refetch, 1 * 60 * 1000)

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    );


    const options = {
        responsive: true,
        plugins: {

        },
    };

    const labels = data && data.sensorReads.map((label) => {
        return formatDateForDisplay(label.created_at)
    });

    const temperatureData = {
        labels,
        datasets: [
            {
                label: 'Temperatura',
                data: data && data.sensorReads.map((label) => {
                    return label.air_temperature
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const humidityData = {
        labels,
        datasets: [
            {
                label: 'Wilgotność powietrza',
                data: data && data.sensorReads.map((label) => {
                    return label.air_humidity
                }),
                borderColor: 'rgb(56,142,231)',
                backgroundColor: 'rgb(99,174,255)',
            },
        ],
    };

    const soilHumidityData = {
        labels,
        datasets: [
            {
                label: 'Wilgotność gleby',
                data: data && data.sensorReads.map((label) => {
                    return label.soil_humidity
                }),
                borderColor: 'rgb(32,121,27)',
                backgroundColor: 'rgb(47,150,40)',
            },
        ],
    };

    const lightData = {
        labels,
        datasets: [
            {
                label: 'Pozim oświetlenia',
                data: data && data.sensorReads.map((label) => {
                    return label.light_level
                }),
                borderColor: 'rgb(196,177,27)',
                backgroundColor: 'rgb(233,214,52)',
            },
        ],
    };

    const pressureData = {
        labels,
        datasets: [
            {
                label: 'Ciśnienie atmosferyczne',
                data: data && data.sensorReads.map((label) => {
                    return label.air_pressure
                }),
                borderColor: 'rgb(27,182,196)',
                backgroundColor: 'rgb(28,219,239)',
            },
        ],
    };

    const cpuData = {
        labels,
        datasets: [
            {
                label: 'Temperatura CPU',
                data: data && data.sensorReads.map((label) => {
                    return label.cpu_temperature
                }),
                borderColor: 'rgb(196,27,27)',
                backgroundColor: 'rgb(239,28,28)',
            },
        ],
    };


    return (
        <>
            <Banner title={'Statystyki'}/>
            <div className={'container mt-3'}>
                <div className={'row'}>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={temperatureData}/>
                        }
                    </div>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={humidityData}/>
                        }
                    </div>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={soilHumidityData}/>
                        }
                    </div>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={lightData}/>
                        }
                    </div>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={pressureData}/>
                        }
                    </div>
                    <div className={'col-md-6'}>
                        {
                            data && <Line options={options} data={cpuData}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Stats;
