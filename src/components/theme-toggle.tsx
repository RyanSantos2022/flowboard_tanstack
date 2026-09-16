import { Moon, Sun } from "lucide-react";
import { useTheme } from "#/components/theme-provider.tsx";
import { Button } from "#/components/ui/button.tsx";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			className="relative"
			aria-label="Alternar tema"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
		</Button>
	);
}
