import axios from "axios";

const tingesoBackendServer = import.meta.env.VITE_TINGESO_BACKEND_SERVER;
const tingesoBackendPort = import.meta.env.VITE_TINGES_BACKEND_PORT;

export default axios.create({
    baseURL: `http://${tingesoBackendServer}:${tingesoBackendPort}`,
    headers:{
        'Content-Type': 'application/json'
    }
});