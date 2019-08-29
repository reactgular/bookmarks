import {EntityId} from '../networks.types';

export interface TemplateEntity extends EntityId {
    title: string;
}

export interface TemplateEntry {
    image?: string;
    title: string;
    url: string;
}
