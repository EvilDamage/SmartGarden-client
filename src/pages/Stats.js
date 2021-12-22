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
            legend: {
                position: 'top',
            },
        },
    };

    const labels = data && data.sensorReads.map((label) => {
        return formatDateForDisplay(label.created_at)
    });

    const dataSheet = {
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
            {
                label: 'Wilgotność powietrza',
                data: data && data.sensorReads.map((label) => {
                    return label.air_humidity
                }),
                borderColor: 'rgb(56,142,231)',
                backgroundColor: 'rgb(99,174,255)',
            },
            {
                label: 'Wilgotność gleby',
                data: data && data.sensorReads.map((label) => {
                    return label.soil_humidity
                }),
                borderColor: 'rgb(32,121,27)',
                backgroundColor: 'rgb(47,150,40)',
            },
            {
                label: 'Pozim oświetlenia',
                data: data && data.sensorReads.map((label) => {
                    return label.light_level
                }),
                borderColor: 'rgb(196,177,27)',
                backgroundColor: 'rgb(233,214,52)',
            },
            {
                label: 'Ciśnienie atmosferyczne',
                data: data && data.sensorReads.map((label) => {
                    return label.air_pressure
                }),
                borderColor: 'rgb(27,182,196)',
                backgroundColor: 'rgb(28,219,239)',
                hidden: true,
            },
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
            <Container className={'mt-3'}>
                {
                    data && <Line options={options} data={dataSheet}/>
                }
            </Container>
        </>
    )
}

export default Stats;
