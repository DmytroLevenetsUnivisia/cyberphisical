"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {Measurement} from "../api";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);

const PREFERENCES_STORAGE_KEY = "sensor-chart-preferences";

type ChartPreferences = {
    timeBasedSpacing?: boolean;
    pointsToShow?: number;
};

function loadPreferences(): ChartPreferences {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const storedPreferences = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (!storedPreferences) {
            return {};
        }

        const preferences: unknown = JSON.parse(storedPreferences);
        if (typeof preferences !== "object" || preferences === null) {
            return {};
        }

        const loadedPreferences: ChartPreferences = {};
        if ("timeBasedSpacing" in preferences && typeof preferences.timeBasedSpacing === "boolean") {
            loadedPreferences.timeBasedSpacing = preferences.timeBasedSpacing;
        }
        if (
            "pointsToShow" in preferences &&
            typeof preferences.pointsToShow === "number" &&
            Number.isInteger(preferences.pointsToShow) &&
            preferences.pointsToShow >= 1
        ) {
            loadedPreferences.pointsToShow = preferences.pointsToShow;
        }
        return loadedPreferences;
    } catch (error) {
        console.error("Unable to load sensor chart preferences.", error);
        return {};
    }
}

function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return [date.toLocaleDateString(), date.toLocaleTimeString()];
}

export default function SensorChart({
                                        measurement,
                                        unit,
                                    }: {
    measurement: Measurement[];
    unit: string;
}) {
    const [timeBasedSpacing, setTimeBasedSpacing] = useState(true);
    const [pointsToShow, setPointsToShow] = useState(Math.max(measurement.length, 1));
    const [preferencesLoaded, setPreferencesLoaded] = useState(false);
    const router = useRouter();
    const visibleReadings = measurement.slice(-pointsToShow);

    useEffect(() => {
        const preferences = loadPreferences();
        if (preferences.timeBasedSpacing !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeBasedSpacing(preferences.timeBasedSpacing);
        }
        if (preferences.pointsToShow !== undefined) {
            setPointsToShow(preferences.pointsToShow);
        }
        setPreferencesLoaded(true);
    }, []);

    useEffect(() => {
        if (!preferencesLoaded) {
            return;
        }

        try {
            window.localStorage.setItem(
                PREFERENCES_STORAGE_KEY,
                JSON.stringify({timeBasedSpacing, pointsToShow}),
            );
        } catch (error) {
            console.error("Unable to save sensor chart preferences.", error);
        }
    }, [pointsToShow, preferencesLoaded, timeBasedSpacing]);

    const data = {
        datasets: [
            {
                label: unit,
                data: visibleReadings.map((reading, index) => ({
                    x: timeBasedSpacing ? reading.timestamp : index,
                    y: reading.value,
                })),
                borderColor: "#06b6d4",
                backgroundColor: "#06b6d4",
                tension: 0,
                cubicInterpolationMode: "linear",
            },
        ],
    };

    return (
        <>
            <div className="mb-3 flex items-center gap-4">
                <label className="flex items-center gap-2 text-white">
                    <input
                        type="checkbox"
                        checked={timeBasedSpacing}
                        onChange={(event) => setTimeBasedSpacing(event.target.checked)}
                    />
                    Time-based spacing
                </label>
                <label className="flex items-center gap-2 text-white">
                    Last points to show
                    <input
                        className="w-20 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-white"
                        type="number"
                        min="1"
                        value={pointsToShow}
                        onChange={(event) => {
                            const value = Number(event.target.value);
                            if (Number.isFinite(value) && value >= 1) {
                                setPointsToShow(Math.floor(value));
                            }
                        }}
                    />
                </label>
                <button
                    type="button"
                    className="rounded border border-gray-600 bg-gray-800 px-3 py-1 text-white hover:bg-gray-700"
                    onClick={() => router.refresh()}
                >
                    Refresh
                </button>
            </div>
            <Line
                //@ts-expect-error Chart.js accepts the runtime dataset shape used here.
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: "linear",
                            title: {
                                display: true,
                                text: timeBasedSpacing
                                    ? "Timestamp"
                                    : "Reading number",
                                color: "#ffffff",
                            },
                            grid: {color: "#606060"},
                            ticks: {
                                color: "#ffffff",
                                callback: (value) => {
                                    const readingIndex = Math.round(Number(value));
                                    const timestamp = timeBasedSpacing
                                        ? Number(value)
                                        : visibleReadings[readingIndex]?.timestamp;

                                    return timestamp === undefined
                                        ? ""
                                        : formatTimestamp(timestamp);
                                },
                            },
                        },
                        y: {
                            title: {display: true, text: unit, color: "#ffffff"},
                            grid: {color: "#606060"},
                            ticks: {color: "#ffffff"},
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {color: "#ffffff"},
                        },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const readingIndex = items[0]?.dataIndex;
                                    const timestamp =
                                        readingIndex === undefined
                                            ? undefined
                                            : visibleReadings[readingIndex]?.timestamp;

                                    return timestamp === undefined
                                        ? ""
                                        : formatTimestamp(timestamp);
                                },
                            },
                        },
                    },
                }}
            />
        </>
    );
}
