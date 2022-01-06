import axios from "axios"
const baseUrl:string = "/api"
const instance = axios.create({
    baseURL:baseUrl,
    timeout: 5000,
    withCredentials:true,
})

export {instance as axios}