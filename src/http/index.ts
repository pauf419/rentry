import axios from 'axios';
import {store} from "../index";
export const API_URL = `/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export default $api;

