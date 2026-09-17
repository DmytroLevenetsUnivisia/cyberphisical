import {api, ApiConnectionError, Sensor} from './api';
import SensorTile from './components/SensorTile';
import Error from "./components/Error";

export default async function Home() {
    let sensors: Sensor[];
    try {
        sensors = await api.getSensors();
    } catch (error) {
        if (error instanceof ApiConnectionError) {
            return <Error msg={error.message}></Error>;
        }
        throw error;
    }

    return (
        <div className={`max-w-5xl m-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4`}>
            {sensors.map((sensor: Sensor) => (
                <SensorTile key={sensor.id} sensor={sensor}/>
            ))}
        </div>
    );
}
