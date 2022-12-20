/**
 * Utility function replacing all query parameters with their respective values
 * @param template Pre-formatted string template
 * @param queryParams Dictionary of query parameters and their values
 */
export function injectToString(template: string, queryParams: Record<string, string>) {
    return template.replace(new RegExp("\{([^\{]+)\}", "g"), (_, varName) => queryParams[varName]);
}