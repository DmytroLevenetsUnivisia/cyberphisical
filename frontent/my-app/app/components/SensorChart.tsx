"use client";

import {useState} from "react";
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {Reading} from "../api";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);

function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return [date.toLocaleDateString(), date.toLocaleTimeString()];
}

export default function SensorChart({
    readings,
    unit,
}: {
    readings: Reading[];
    unit: string;
}) {
    const [timeBasedSpacing, setTimeBasedSpacing] = useState(true);

    const data = {
        datasets: [
            {
                label: unit,
                data: readings.map((reading, index) => ({
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
            <label className="mb-3 flex items-center gap-2 text-white">
                <input
                    type="checkbox"
                    checked={timeBasedSpacing}
                    onChange={(event) => setTimeBasedSpacing(event.target.checked)}
                />
                Time-based spacing
            </label>
            <Line
                //@ts-ignore
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
                                        : readings[readingIndex]?.timestamp;

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
                                            : readings[readingIndex]?.timestamp;

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
