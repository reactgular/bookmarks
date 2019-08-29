import {faCheck, faExclamationTriangle, faSpinner, faSync} from '@fortawesome/free-solid-svg-icons';

export interface TopBarRefreshState {
    animate?: string;
    color?: 'success' | 'warning' | 'danger' | 'info';
    disabled?: boolean;
    icon: any;
    title: string;
}

export const REFRESH_TOOL_DEFAULT: TopBarRefreshState = {
    icon: faSync,
    title: 'Refresh'
};

export const REFRESH_TOOL_READ: TopBarRefreshState = {
    disabled: true,
    animate: 'pulse',
    icon: faSpinner,
    title: 'Loading...'
};

export const REFRESH_TOOL_WRITE: TopBarRefreshState = {
    disabled: true,
    animate: 'pulse',
    icon: faSpinner,
    title: 'Saving...'
};

export const REFRESH_TOOL_SUCCESS: TopBarRefreshState = {
    disabled: true,
    icon: faCheck,
    title: 'Saved',
    color: 'success'
};

export const SAVE_CHANGES_FATAL_ERROR: TopBarRefreshState = {
    disabled: false,
    icon: faExclamationTriangle,
    title: 'Changes could not be saved',
    color: 'danger'
};

export const REFRESH_TOOL_ERROR: TopBarRefreshState = {
    disabled: false,
    icon: faExclamationTriangle,
    title: 'Network difficulties...',
    color: 'danger'
};
