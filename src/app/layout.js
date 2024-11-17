import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "AgentsUI",
	description:
		"AgentsUI is a sleek, user-friendly interface for managing, monitoring, and optimizing agent-based systems.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
