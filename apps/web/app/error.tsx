"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({
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
		<div className="flex items-center justify-center min-h-screen">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold">Bir Hata Oluştu</CardTitle>
					<CardDescription className="text-lg mt-2">Üzgünüz, bir şeyler yanlış gitti</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<div className="h-40 flex items-center justify-center mb-4">
						<AlertCircleIcon className="w-32 h-32 text-destructive/70" strokeWidth={1} />
					</div>
					<p className="mb-4">Sayfayı yeniden yüklemeyi deneyin veya ana sayfaya dönün.</p>
				</CardContent>
				<CardFooter className="flex justify-center gap-4">
					<Button variant="outline" onClick={reset}>
						Tekrar Dene
					</Button>
					<Button asChild>
						<Link href="/dashboard">Ana Sayfaya Dön</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
