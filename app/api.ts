const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

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
    size: number,
    sort?: string,
    from?: number,
    breeds?: string[], 
    zipCodes?: string[], 
    ageMin?: number, 
    ageMax?: number 
) => {
    const params = new URLSearchParams();
    params.set('size', size.toString());
    if (sort !== undefined) {
        params.set('sort', sort.toString());
    }
    if (from !== undefined) {
        params.set('from', from.toString());
    }
    if (breeds !== undefined) {
        for (const breed of breeds) {
            params.append('breeds', breed);
        }
    }
    if (zipCodes !== undefined) {
        for (const zipCode of zipCodes) {
            params.append('zipCodes', zipCode);
        }
    }
    if (ageMin !== undefined) {
        params.set('ageMin', ageMin.toString());
    }
    if (ageMax !== undefined) {
        params.set('ageMax', ageMax.toString());
    }

    return fetch(`${API_BASE_URL}/dogs/search?${params}`, {
        credentials: "include"
    })
}

export const getBreeds = async () => {
    return fetch(`${API_BASE_URL}/dogs/breeds`, {
        
        credentials: "include",
    });
}


export const getDogsByIds = async (ids: string[]) => {
    return fetch(`${API_BASE_URL}/dogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids),
        credentials: "include",
    })
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


