export interface ApiResponse<TType> {
    /**
     * Response data
     */
    data?: TType;
    /**
     * Developer message describing the status.
     */
    message?: string;
    /**
     * Status of processing the request relative to business logic.
     */
    status: string;
}
