import { effectScope, ref, watch } from "vue";

type Theme = "dark" | "light";

const STORAGE_KEY = "veyra-theme";

function readSavedTheme(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function getInitialTheme(): Theme {
    const saved = readSavedTheme();

    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const theme = ref<Theme>("dark");
let initialized = false;

// Runs on first use in the browser instead of at import time, so the package is SSR-safe
// and does not touch <html> unless the app actually uses the theme.
function initTheme() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;

    theme.value = getInitialTheme();

    // Detached scope: the watcher must outlive the component that first called useTheme().
    effectScope(true).run(() => {
        watch(
            theme,
            (value) => {
                document.documentElement.dataset.theme = value;
                try {
                    localStorage.setItem(STORAGE_KEY, value);
                } catch {
                    // Storage can be unavailable (private mode, blocked cookies).
                }
            },
            { immediate: true },
        );
    });
}

export function useTheme() {
    initTheme();

    function toggleTheme() {
        theme.value = theme.value === "dark" ? "light" : "dark";
    }

    return { theme, toggleTheme };
}
