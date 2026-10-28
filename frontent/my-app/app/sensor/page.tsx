import {api, ApiConnectionError, Measurement, Sensor} from "../api";
import LiveSensorChart from "../components/LiveSensorChart";
import Error from "../components/Error";

type SearchParams = Promise<{ id?: string }>;

export default async function SensorPage({searchParams}: { searchParams: SearchParams }) {
    const {id} = await searchParams;

    if (!id) {
        return <Error msg={"Sensor ID is missing."}></Error>;
    }

    let sensor: Sensor;
    let measurements: Measurement[];
    try {
        sensor = await api.getSensor(id);
        measurements = await api.getAllMeasurements(id);
    } catch (error) {
        if (error instanceof ApiConnectionError) {
            return <Error msg={error.message}></Error>;
        }
        throw error;
    }

    return (
        <div className={`max-w-5xl m-auto bg-gray-900`}>
            <div className={`p-5`}>
                <p className="">Name: {sensor.name}</p>
                <div className="mt-5 h-96">
                    <LiveSensorChart
                        sensorId={id}
                        initialMeasurements={measurements}
                        unit={sensor.unit}
                        backendUrl={process.env.BACKEND_URL || 'MOCK'}
                    />
                </div>
            </div>
        </div>
    );
}
