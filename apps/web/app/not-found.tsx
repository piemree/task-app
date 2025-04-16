import { FrownIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<CardTitle className="text-4xl font-bold">404</CardTitle>
					<CardDescription className="text-xl mt-2">Page Not Found</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-4">The page you're looking for could not be found or has been moved.</p>
					<div className="h-40 flex items-center justify-center mb-4">
						<FrownIcon className="w-32 h-32 text-muted-foreground" strokeWidth={1} />
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button asChild>
						<Link href="/dashboard">Return to Home Page</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
