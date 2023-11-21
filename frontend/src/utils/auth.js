import { checkResponse } from "./checkResponse";

const BASE_URL = 'http://localhost:3000';

function _request(url, method, body, token) {

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        const token = localStorage.getItem('jwt');
        headers.Authorization = `Bearer ${token}`;
    };

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };
    
    return fetch(url, options)
            .then(checkResponse)
            .catch(error => {
                console.error(error);
                throw error;
            });
}


export const register = ({email, password}) => {
    return _request(`${BASE_URL}/signup`, "POST", {email, password}, null);
}

export const authorize = ({email, password}) => {
    return _request(`${BASE_URL}/signin`, "POST", {email, password}, null);
}

export const getContent = (token) => {
    return _request(`${BASE_URL}/users/me`, "GET", null, token);
}