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
		<html lang="tr">
			<body>
				<div className="flex items-center justify-center min-h-screen p-4">
					<Card className="max-w-md w-full">
						<CardHeader className="text-center">
							<CardTitle className="text-3xl font-bold">Kritik Hata</CardTitle>
							<CardDescription className="text-lg mt-2">Üzgünüz, ciddi bir hata oluştu</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<div className="h-40 flex items-center justify-center mb-4">
								<AlertOctagonIcon className="w-32 h-32 text-destructive" strokeWidth={1} />
							</div>
							<p className="mb-4">
								Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen sayfayı yenilemeyi deneyin veya Ana Sayfaya dönün.
							</p>
						</CardContent>
						<CardFooter className="flex justify-center gap-4">
							<Link href="/dashboard">
								<Button variant="outline">Ana Sayfaya Dön</Button>
							</Link>
							<Button onClick={reset}>Sayfayı Yenile</Button>
						</CardFooter>
					</Card>
				</div>
			</body>
		</html>
	);
}
