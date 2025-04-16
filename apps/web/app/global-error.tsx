"use client";

import { AlertOctagonIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex items-center justify-center min-h-screen p-4">
					<Card className="max-w-md w-full">
						<CardHeader className="text-center">
							<CardTitle className="text-3xl font-bold">Critical Error</CardTitle>
							<CardDescription className="text-lg mt-2">Sorry, a serious error has occurred</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<div className="h-40 flex items-center justify-center mb-4">
								<AlertOctagonIcon className="w-32 h-32 text-destructive" strokeWidth={1} />
							</div>
							<p className="mb-4">
								The application encountered an unexpected error. Please try refreshing the page or return to the Home
								Page.
							</p>
						</CardContent>
						<CardFooter className="flex justify-center gap-4">
							<Link href="/dashboard">
								<Button variant="outline">Return to Home Page</Button>
							</Link>
							<Button onClick={reset}>Refresh Page</Button>
						</CardFooter>
					</Card>
				</div>
			</body>
		</html>
	);
}
