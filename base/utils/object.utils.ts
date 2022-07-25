export class ObjectUtils {
    static overrideParams = <T>(object: T, paramsToBeAssigned: Partial<T>): void => {
        for (const paramsKey of Object.keys(paramsToBeAssigned) as Array<keyof T>) {
            // @ts-ignore
            object[paramsKey] = paramsToBeAssigned[paramsKey]
        }
    }
}
