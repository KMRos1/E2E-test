type TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => Promise<T>

export class TimeoutError extends Error {}

export const runWithTimeout: TimeoutPromise = <T>(promise: Promise<T>, delayInMilliseconds: number) => {
    const timeout = new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId)
            reject(new TimeoutError(`Timed out after ${delayInMilliseconds}ms`))
        }, delayInMilliseconds)
    })

    return Promise.race([promise, timeout])
}
