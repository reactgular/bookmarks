export interface HotKey {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    shiftKey: boolean;
}

export function parseHotKey(value: string): HotKey {
    const parts = value.trim().toUpperCase().replace(/\s/g, '').split('+');
    const hotKey: HotKey = {
        altKey: false,
        ctrlKey: false,
        key: parts[parts.length - 1].toLowerCase(),
        shiftKey: false
    };
    if (hotKey.key === 'shift') {
        hotKey.shiftKey = true;
    }
    const remap = {
        'del': 'delete',
        'esc': 'escape',
        'back': 'backspace'
    };
    if (remap[hotKey.key]) {
        hotKey.key = remap[hotKey.key];
    }
    parts.pop();
    parts.forEach(part => {
        switch (part) {
            case 'CTRL':
                hotKey.ctrlKey = true;
                break;
            case 'ALT':
                hotKey.altKey = true;
                break;
            case 'SHIFT':
                hotKey.shiftKey = true;
                break;
            default:
                throw new Error(`Invalid special key: ${part}`);
        }
    });
    return hotKey;
}
