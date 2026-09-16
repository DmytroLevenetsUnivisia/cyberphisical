import {api, Sensor} from './api';
import SensorTile from './components/SensorTile';

export default async function Home() {
    const sensors = await api.getSensors();
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4`}>
            {sensors.map((sensor: Sensor) => (
                <SensorTile key={sensor.id} sensor={sensor}/>
            ))}
        </div>
    );
}
