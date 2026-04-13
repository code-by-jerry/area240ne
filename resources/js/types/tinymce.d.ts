interface TinyMceEditorInstance {
    initialized: boolean;
    getContent: () => string;
    setContent: (content: string) => void;
    setMode: (mode: 'design' | 'readonly') => void;
    remove?: () => void;
    destroy?: () => void;
    on: (event: string, callback: () => void) => void;
}

interface TinyMceInitOptions {
    target: HTMLElement;
    branding?: boolean;
    promotion?: boolean;
    menubar?: boolean | string;
    min_height?: number;
    resize?: boolean;
    statusbar?: boolean;
    plugins?: string;
    toolbar?: string;
    content_style?: string;
    setup?: (editor: TinyMceEditorInstance) => void;
}

interface TinyMceGlobal {
    init: (options: TinyMceInitOptions) => Promise<TinyMceEditorInstance | TinyMceEditorInstance[]>;
    remove?: (editor?: TinyMceEditorInstance) => void;
}

interface Window {
    tinymce?: TinyMceGlobal;
}
