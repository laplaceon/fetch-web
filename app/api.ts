const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

interface Location {
    zip_code: string
    latitude: number
    longitude: number
    city: string
    state: string
    county: string
}

interface Coordinates {
    lat: number
    lon: number
}

export interface User {
    name: string
    email: string
}

export const login = async (name: string, email: string): Promise<Response> => {
    const body = {
        "name": name,
        "email": email
    }

    return fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export const logout = async () => {
    return fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    }); 
}

export const getDogsByQuery = async (
    size: number = 25,
    sort?: string,
    from?: number,
    breeds?: string[], 
    zipCodes?: string[], 
    ageMin?: number, 
    ageMax?: number 
) => {
}

export const getBreeds = async () => {
    return fetch(`${API_BASE_URL}/dogs/breeds`, {
        credentials: "include",
    });
}


export const getDogsByIds = async (ids: number[]) => {
}

export const getDogsByMatch = async () => {
    
}

export const getLocationsByZipcodes = async (zipCodes: string[]) => {

}

export const getLocationsByQuery = async (
    size: number = 25,
    from?: number,
    city?: string,
    states?: string[],
    geoBoundingBox?: {
        top: Location,
        left: Location,
        bottom: Location,
        right: Location
    } | {
        bottom_left: Location,
        top_right: Location
    } | {
        bottom_right: Location,
        top_left: Location
    }
) => {

}


