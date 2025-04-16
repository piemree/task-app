"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { IInviteTokenPayload } from "@api/types/token.types";
import { CheckCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { InviteRegisterForm } from "./invite-register-form";

interface InviteAcceptPageProps {
	token: string;
	tokenPayload: IInviteTokenPayload;
	inviteSuccess: boolean;
	needRegister: boolean;
}

export function InviteAcceptPage({ token, tokenPayload, inviteSuccess, needRegister }: InviteAcceptPageProps) {
	const router = useRouter();

	return (
		<div className="container flex items-center justify-center min-h-screen py-10">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Project Invitation</CardTitle>
					<CardDescription>You have been invited to join a project team.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{inviteSuccess ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<CheckCircle className="w-16 h-16 text-green-500" />
							<p className="text-center text-lg">
								Invitation accepted successfully. You are now part of the project team.
							</p>
						</div>
					) : needRegister ? (
						<div className="flex flex-col items-center justify-center py-6 space-y-4">
							<UserPlus className="w-16 h-16 text-blue-500" />
							<p className="text-center text-lg">You need to register first to accept this invitation.</p>
							<InviteRegisterForm token={token} tokenPayload={tokenPayload} />
						</div>
					) : null}
				</CardContent>
				{inviteSuccess && (
					<CardFooter>
						<Button className="w-full" onClick={() => router.push("/dashboard")}>
							Go to Dashboard
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
