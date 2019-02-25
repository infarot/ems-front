import {API_BASE_URL, ACCESS_TOKEN} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function getSeamstressList() {
    return request({
        url: API_BASE_URL + "/seamstress",
        method: 'GET'
    });
}

export function getSeamstressListFromDateRange(from, to) {
    return request({
        url: API_BASE_URL + "/seamstress/" + from + "/" + to,
        method: 'GET'
    });
}

export function getShiftProduction() {
    return request({
        url: API_BASE_URL + "/shiftProduction",
        method: 'GET'
    });
}

export function getSeamstressResults(id) {
    return request({
        url: API_BASE_URL + "/seamstress/dailyResults/" + id,
        method: 'GET'
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}