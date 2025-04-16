import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "../styles/globals.css";
import { ReduxProvider } from "@/components/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Project Management",
	description: "Project and task management application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ReduxProvider>
						{children}
						<Toaster />
					</ReduxProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
