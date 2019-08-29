import {HotKeyDescription, HotKeySectionEnum} from './hot-keys.types';

export interface HotKeySection {
    descriptions: HotKeyDescription[];
    message?: string;
    title: string;
    type: HotKeySectionEnum;
}

export const HOT_KEY_SECTIONS: Partial<HotKeySection>[] = [
    {
        type: HotKeySectionEnum.GENERAL,
        title: 'Application'
    }, {
        type: HotKeySectionEnum.SELECTION,
        title: 'Selections',
        message: 'Actions you can perform on selected cards.'
    }
];
