"use client";

import {useEffect, useState} from "react";
import {api, HotWaterAlert as Alert} from "../api";

export default function HotWaterAlert({
                                          sensorId,
                                          backendUrl,
                                      }: {
    sensorId: string;
    backendUrl: string;
}) {
    const [alert, setAlert] = useState<Alert | null>(null);

    useEffect(() => {
        const source = api.subscribeToHotWaterAlerts(
            backendUrl,
            sensorId,
            (newAlert) => {
                setAlert(newAlert);
            },
        );
        return () => {
            source.close();
        };
    }, [backendUrl, sensorId]);

    if (!alert) {
        return null;
    }

    const dateTime = new Date(alert.timestamp * 1000).toLocaleString();
    return (
        <div className={`mt-5 p-2 rounded-lg border-2 border-white text-sm bg-cyan-900`}>
            <p>{alert.message}: {alert.value}</p>
            <p>Time: {dateTime}</p>
        </div>
    );
}
