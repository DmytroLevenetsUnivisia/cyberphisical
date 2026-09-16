import {Sensor} from "../api";
import Link from 'next/link';

export default function SensorTile({sensor}: { sensor: Sensor }) {
    const lastReading = sensor.readings[sensor.readings.length - 1];
    const dateTime = new Date(lastReading?.timestamp * 1000).toLocaleString();
    console.log(sensor.id)
    return (
        <Link
            href={`/sensor?id=${sensor.id}`}
            className={`max-w-60 bg-cyan-900 p-2 rounded-lg border-2 border-white shadow-md text-sm hover:bg-cyan-700 transition-all duration-200 cursor-pointer`}>
            <h2>{sensor.name}</h2>
            <p>Last: {lastReading?.value} {sensor.unit}</p>
            <p>Time: {dateTime}</p>
        </Link>
    )
}