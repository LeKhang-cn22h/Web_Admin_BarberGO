
import apiClient from "axios";

export const authApi = (payload:{
    email:string,
    password:string
})=>{
    return apiClient.post('/auth/login',payload)};