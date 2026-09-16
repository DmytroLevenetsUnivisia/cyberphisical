import {api} from "../api";
import SensorChart from "../components/SensorChart";

type SearchParams = Promise<{ id?: string }>;

export default async function SensorPage({searchParams}: { searchParams: SearchParams }) {
    const {id} = await searchParams;

    if (!id) {
        return <p>Sensor ID is missing.</p>;
    }

    const sensor = await api.getSensor(id);
    return (
        <div className={`max-w-5xl m-auto bg-gray-900`}>
            <div className={`p-5`}>
                <p className="">Name: {sensor.name}</p>
                <div className="mt-5 h-96">
                    <SensorChart readings={sensor.readings} unit={sensor.unit}/>
                </div>
            </div>
        </div>
    );
}