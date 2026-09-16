import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "flowboard-theme";

function applyTheme(theme: Theme) {
	const root = window.document.documentElement;
	const resolved =
		theme === "system"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: theme;

	root.classList.toggle("dark", resolved === "dark");
}

const ThemeProviderContext = React.createContext<ThemeProviderState | null>(
	null,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = React.useState<Theme>(() => {
		if (typeof window === "undefined") return "system";
		return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
	});

	React.useEffect(() => {
		applyTheme(theme);

		if (theme !== "system") return;

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyTheme("system");

		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [theme]);

	const setTheme = React.useCallback((next: Theme) => {
		localStorage.setItem(STORAGE_KEY, next);
		setThemeState(next);
	}, []);

	const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

	return (
		<ThemeProviderContext.Provider value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	const context = React.useContext(ThemeProviderContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
