"use client";

import {useEffect, useState} from "react";
import {api, Measurement} from "../api";
import SensorChart from "./SensorChart";

export default function LiveSensorChart({
                                            sensorId,
                                            initialMeasurements,
                                            unit,
                                            backendUrl,
                                        }: {
    sensorId: string;
    initialMeasurements: Measurement[];
    unit: string;
    backendUrl: string;
}) {
    const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);

    useEffect(() => {
        const lastId = initialMeasurements.at(-1)?.id ?? null;
        const source = api.subscribeToSensorMeasurements(
            backendUrl,
            sensorId,
            lastId,
            (newMeasurement) => {
                setMeasurements((prev) => [...prev, newMeasurement]);
            },
        );
        return () => {
            source.close();
        };
    }, [backendUrl, sensorId, initialMeasurements]);

    return <SensorChart measurement={measurements} unit={unit}/>;
}
