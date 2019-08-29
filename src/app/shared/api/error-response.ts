export interface ErrorTraceResponse {
    args: any[];
    class: string;
    file: string;
    function: string;
    line: number;
    type: string;
}

export interface ErrorDebugResponse {
    file?: string;
    line?: number;
    trace?: ErrorTraceResponse[];
}

export interface ErrorResponse extends ErrorDebugResponse {
    code: number;
    error: any;
    message: string;
    url: string;
}
