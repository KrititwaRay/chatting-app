export interface IMethodNotAllowed {
    setHeader(value1: string, value2: string): object,
    send(value3: object): object,
    status(value4: number): object,
}

export interface successResponse {
    status(value2: number): object,
    send(value1: object): object
}

export interface sendBadRequest {
    status(value2: number): object,
    send(value1: object): object
}