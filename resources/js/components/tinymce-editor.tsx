import { useEffect, useId, useRef, useState } from 'react';

const TINYMCE_SCRIPT_ID = 'tiny-mce-script';
const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY ?? 'yuyg8kxxy8yo1i8fixyi16cur59a75hij0jrnonghc0oss65';

type TinyMceEditorProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    height?: number;
};

let scriptPromise: Promise<void> | null = null;

function loadTinyMceScript() {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }

    if (window.tinymce) {
        return Promise.resolve();
    }

    if (scriptPromise) {
        return scriptPromise;
    }

    scriptPromise = new Promise((resolve, reject) => {
        const existing = document.getElementById(TINYMCE_SCRIPT_ID) as HTMLScriptElement | null;

        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load TinyMCE.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = TINYMCE_SCRIPT_ID;
        script.src = `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/7/tinymce.min.js`;
        script.referrerPolicy = 'origin';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load TinyMCE.'));
        document.head.appendChild(script);
    });

    return scriptPromise;
}

function resolveEditor(instance: TinyMceEditorInstance | TinyMceEditorInstance[]): TinyMceEditorInstance | null {
    return Array.isArray(instance) ? instance[0] ?? null : instance;
}

function destroyEditor(editor: TinyMceEditorInstance | null) {
    if (!editor) {
        return;
    }

    if (typeof editor.remove === 'function') {
        editor.remove();
        return;
    }

    if (typeof editor.destroy === 'function') {
        editor.destroy();
        return;
    }

    window.tinymce?.remove?.(editor);
}

export function TinyMceEditor({ value, onChange, disabled = false, height = 420 }: TinyMceEditorProps) {
    const textareaId = useId();
    const hostRef = useRef<HTMLTextAreaElement | null>(null);
    const editorRef = useRef<TinyMceEditorInstance | null>(null);
    const latestOnChangeRef = useRef(onChange);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    latestOnChangeRef.current = onChange;

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setLoadError(null);

        loadTinyMceScript()
            .then(async () => {
                if (cancelled || !hostRef.current || !window.tinymce) {
                    return;
                }

                const initializedEditor = resolveEditor(await window.tinymce.init({
                    target: hostRef.current,
                    branding: false,
                    promotion: false,
                    menubar: 'file edit view insert format tools table help',
                    min_height: height,
                    resize: true,
                    statusbar: true,
                    plugins: 'anchor autolink charmap code codesample fullscreen help image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
                    toolbar:
                        'undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code preview fullscreen',
                    content_style:
                        'body { font-family: Georgia, Cambria, serif; font-size: 16px; line-height: 1.75; margin: 1rem; color: #0f172a; }',
                    setup: (instance) => {
                        instance.on('init', () => {
                            instance.setContent(value || '');
                            setLoading(false);
                        });

                        instance.on('change input undo redo', () => {
                            latestOnChangeRef.current(instance.getContent());
                        });
                    },
                }));

                if (!initializedEditor) {
                    throw new Error('TinyMCE editor instance was not created.');
                }

                if (cancelled) {
                    destroyEditor(initializedEditor);
                    return;
                }

                editorRef.current = initializedEditor;
            })
            .catch((error: unknown) => {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : 'Failed to load TinyMCE.');
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
            destroyEditor(editorRef.current);
            editorRef.current = null;
        };
    }, [height]);

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor || !editor.initialized) {
            return;
        }

        const currentContent = editor.getContent();

        if (value !== currentContent) {
            editor.setContent(value || '');
        }
    }, [value]);

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor || !editor.initialized) {
            return;
        }

        editor.setMode(disabled ? 'readonly' : 'design');
    }, [disabled]);

    return (
        <div className="space-y-2">
            {loading && !loadError && (
                <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-sm text-muted-foreground">
                    Loading editor...
                </div>
            )}

            {loadError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {loadError}
                </div>
            )}

            <textarea
                id={textareaId}
                ref={hostRef}
                defaultValue={value}
                className={loading || loadError ? 'hidden' : ''}
            />
        </div>
    );
}
