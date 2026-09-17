import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.BACKEND_URL || 'MOCK',
    headers: {'Content-Type': 'application/json'},
});

export class ApiConnectionError extends Error {
    constructor() {
        super('Unable to connect to the backend service.');
        this.name = 'ApiConnectionError';
    }
}

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (
            axios.isAxiosError(error) &&
            (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')
        ) {
            throw new ApiConnectionError();
        }
        throw error;
    },
);

export interface Measurement {
    timestamp: number
    value: number
}

export interface Sensor {
    id: string
    name: string
    unit: string
    measurement: Measurement[]
}

export interface CreateSensor {
    name: string
    value: number
    unit: string
}

export interface Sensors {
    sensors: Sensor[]
}

export const api = {
    async getSensors(): Promise<Sensor[]> {
        const {data} = await apiClient.get<Sensor[]>('/sensors');
        return data;
    },

    async getSensor(id: string): Promise<Sensor> {
        const {data} = await apiClient.get<Sensor>(`/sensors/${id}`);
        return data;
    },

    async createSensor(sensor: CreateSensor): Promise<Sensor> {
        const {data} = await apiClient.post<Sensor>('/sensors', sensor);
        return data;
    },

    async patchSensor(id: string, value: number): Promise<Sensor> {
        const {data} = await apiClient.patch<Sensor>(`/sensors/${id}`, value);
        return data;
    },

    async deleteSensor(id: string): Promise<Sensor> {
        const {data} = await apiClient.delete(`/sensors/${id}`);
        return data;
    }
}