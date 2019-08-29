import {faCheck, faCloudDownloadAlt, faExclamationTriangle, faQuestionCircle, faSpinner} from '@fortawesome/free-solid-svg-icons';

export interface MetaToolState {
    color?: 'success' | 'warning' | 'danger' | 'info';
    disabled: boolean;
    icon: any;
    title: string;
    toolTip: string;
}

export interface MetaToolData {
    image?: string;
    success: boolean;
    title?: string;
}

export const META_TOOL_DEFAULT: MetaToolState = {
    disabled: false,
    icon: faCloudDownloadAlt,
    title: '',
    toolTip: 'Fetch page title'
};

export const META_TOOL_FETCHING: MetaToolState = {
    disabled: true,
    icon: faSpinner,
    title: 'Fetching a title for the bookmark...',
    toolTip: 'Fetching page title'
};

export const META_TOOL_SUCCESS: MetaToolState = {
    disabled: false,
    icon: faCheck,
    title: 'Title was successfully fetched.',
    toolTip: 'Success',
    color: 'success'
};

export const META_TOOL_NO_TITLE: MetaToolState = {
    disabled: false,
    icon: faCheck,
    title: 'No page title was found.',
    toolTip: 'Success',
    color: 'success'
};

export const META_TOOL_CONTENT_TYPE: MetaToolState = {
    disabled: false,
    icon: faQuestionCircle,
    title: 'No page title for this content type.',
    toolTip: 'Notice',
    color: 'warning'
};

export const META_TOOL_ERROR: MetaToolState = {
    disabled: false,
    icon:  faExclamationTriangle,
    title: 'Unable to fetch title for bookmark.',
    toolTip: 'Problem',
    color: 'danger'
};
