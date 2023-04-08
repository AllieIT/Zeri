/**
 * Utility function replacing all query parameters with their respective values
 * @param template Pre-formatted string template
 * @param queryParams Dictionary of query parameters and their values
 */
export function injectToString(template: string, queryParams: Record<string, string>) {
    return template.replace(new RegExp("\{([^\{]+)\}", "g"), (_, varName) => queryParams[varName]);
}

/**
 * Utility function adding query parameters to URL
 * @param url Pre-formatted URL
 * @param queryParams Dictionary of query parameters and their values (can be null)
 */
export function addQueryString(url: string, queryParams: Record<string, any>) {
    const query = Object.keys(queryParams)
        .filter(key => queryParams[key] !== undefined && queryParams[key] !== null)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');
    return `${url}?${query}`;
}