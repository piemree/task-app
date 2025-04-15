"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import { CheckCircle, UserPlus, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface InviteAcceptPageProps {
	token: string;
}

export function InviteAcceptPage({ token }: InviteAcceptPageProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [needsRegistration, setNeedsRegistration] = useState(false);

	useEffect(() => {
		const acceptInvite = async () => {
			try {
				const response = await projectService.acceptInvite({ inviteToken: token });

				if (response.isUnRegistered) {
					setNeedsRegistration(true);
					setError("Daveti kabul etmek için önce kayıt olmanız gerekiyor.");
				} else if (response.success) {
					setIsSuccess(true);
					toast({
						title: "Davet kabul edildi",
						description: "Proje ekibine başarıyla katıldınız.",
					});
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Davet kabul edilirken bir hata oluştu");
				toast({
					variant: "destructive",
					title: "Davet kabul edilemedi",
					description: "Davet kabul edilirken bir hata oluştu. Lütfen tekrar deneyin.",
				});
			} finally {
				setIsLoading(false);
			}
		};

		acceptInvite();
	}, [token]);

	return (
		<div className="container flex items-center justify-center min-h-screen py-10">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Proje Daveti</CardTitle>
					<CardDescription>Bir proje ekibine katılmak için davet aldınız.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
							<p className="text-center">Davet işleniyor...</p>
						</div>
					) : isSuccess ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<CheckCircle className="w-16 h-16 text-green-500" />
							<p className="text-center text-lg">
								Davet başarıyla kabul edildi. Artık proje ekibinin bir parçasısınız.
							</p>
						</div>
					) : needsRegistration ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<UserPlus className="w-16 h-16 text-blue-500" />
							<p className="text-center text-lg">
								Bu daveti kabul etmek için önce sisteme kayıt olmanız gerekmektedir.
							</p>
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<XCircle className="w-16 h-16 text-red-500" />
							<p className="text-center text-lg">{error}</p>
						</div>
					) : null}
				</CardContent>
				{isSuccess && (
					<CardFooter>
						<Button className="w-full" onClick={() => router.push("/dashboard")}>
							Dashboard'a Git
						</Button>
					</CardFooter>
				)}
				{needsRegistration && (
					<CardFooter>
						<Button className="w-full" onClick={() => router.push("/auth/register")}>
							Kayıt Ol
						</Button>
					</CardFooter>
				)}
				{error && !needsRegistration && (
					<CardFooter>
						<Button className="w-full" onClick={() => router.push("/dashboard")}>
							Dashboard'a Git
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
