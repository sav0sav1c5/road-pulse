const BASE_URL = 'http://localhost:8000/api/v1';

// Helper function for all endpoint calls
async function apiFetch(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export function getAccidents(page = 1, pageSize = 20) {
    return apiFetch(`/accidents?page=${page}&page_size=${pageSize}`);
}

export function getAccidentById(id) {
    return apiFetch(`/accidents/${id}`);
}

export function getStatsByDepartment() {
    return apiFetch(`/accidents/statistics/department`);
}

export function getStatsByYear() {
    return apiFetch(`/accidents/statistics/year`);
}

export function getStatsByHour() {
    return apiFetch(`/accidents/statistics/hour`);
}

export function getStatsByType() {
    return apiFetch(`/accidents/statistics/type`);
}

export function predictSeverity(data) {
    return fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    }).then(res => {
        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }
        
        return res.json();
    })
}