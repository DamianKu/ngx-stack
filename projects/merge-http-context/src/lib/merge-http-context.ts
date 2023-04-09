import { HttpContext } from "@angular/common/http";

/**
 * Merge multiple {@link HttpContext}s into one {@link HttpContext}
 * @param contexts {@link HttpContext}s to be merged
 * @returns {@link HttpContext} with values from all passed {@link HttpContext}s
 */
export function mergeHttpContext(...contexts: HttpContext[]): HttpContext {
    return contexts.reduce((acc, cur) => {
        [...cur.keys()].forEach(k => {
            acc.set(k, cur.get(k));
        });

        return acc;
    }, new HttpContext());
}