export interface FeatureLoaderState {
    canRetry?: boolean;
    message?: string;
    type: 'busy' | 'error';
}
