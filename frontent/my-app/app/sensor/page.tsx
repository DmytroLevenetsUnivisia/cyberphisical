"use client";
import {api, ApiConnectionError, Measurement} from "../api";
import SensorChart from "../components/SensorChart";
import Error from "../components/Error";
import {useEffect, useState} from "react";

type SearchParams = Promise<{ id?: string }>;

export default async function SensorPage({searchParams}: { searchParams: SearchParams }) {
    const {id} = await searchParams;
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    if (!id) {
        return <Error msg={"Sensor ID is missing."}></Error>;
    }

    let sensor;
    try {
        sensor = await api.getSensor(id);
        setMeasurements(sensor.measurement);
    } catch (error) {
        if (error instanceof ApiConnectionError) {
            return <Error msg={error.message}></Error>;
        }
        throw error;
    }

    useEffect(() => {
        const source = api.subscribeToSensorMeasurements(
            id,
            measurements.at(measurements.length - 1)!.timestamp,
            ((newMeasurement) => {
                setMeasurements([...measurements, newMeasurement])
            }),
        );
        return () => {
            source.close();
        };
    }, [id])

    return (
        <div className={`max-w-5xl m-auto bg-gray-900`}>
            <div className={`p-5`}>
                <p className="">Name: {sensor.name}</p>
                <div className="mt-5 h-96">
                    <SensorChart measurement={measurements} unit={sensor.unit}/>
                </div>
            </div>
        </div>
    );
}