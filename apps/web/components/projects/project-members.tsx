"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/redux/hooks";
import { projectService } from "@/services/project-service";
import type { ProjectMember } from "@schemas/project.schema";
import { X } from "lucide-react";
import { useState } from "react";
import { InviteMemberDialog } from "./invite-member-dialog";

type ProjectMembersProps = {
	projectId: string;
	members: ProjectMember[];
	onRemoveMember: (userId: string) => void;
};

export function ProjectMembers({ projectId, members, onRemoveMember }: ProjectMembersProps) {
	const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
	const { user } = useAppSelector((state) => state.auth);

	const handleRemoveMember = async (userId: string) => {
		if (!projectId) return;

		try {
			await projectService.removeMember(projectId, userId);
			onRemoveMember(userId);
			toast({
				title: "Üye kaldırıldı",
				description: "Üye projeden kaldırıldı.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Üye kaldırılamadı",
				description: "Üye kaldırılırken bir hata oluştu.",
			});
		}
	};

	const openRemoveConfirmation = (userId: string) => {
		if (userId === user?._id) {
			toast({
				variant: "destructive",
				title: "İşlem engellendi",
				description: "Kendinizi projeden kaldıramazsınız.",
			});
			return;
		}

		setMemberToRemove(userId);
	};

	const closeRemoveConfirmation = () => {
		setMemberToRemove(null);
	};

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "default";
			case "manager":
				return "secondary";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">Proje Üyeleri</h3>
				<InviteMemberDialog projectId={projectId} />
			</div>

			<div className="grid gap-4">
				{members.map((member) => (
					<Card key={member._id}>
						<CardContent className="p-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarFallback>
										{`${member.user.firstName[0] || ""}${member.user.lastName[0] || ""}`.toUpperCase()}{" "}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{member.user.firstName} {member.user.lastName} {member.user._id === user?._id && "(BEN)"}
									</p>
									<Badge variant={getRoleBadgeVariant(member.role)} className="mt-1">
										{member.role}
									</Badge>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => openRemoveConfirmation(member.user._id)}
								disabled={member.user._id === user?._id}
							>
								<X className="h-4 w-4" />
								<span className="sr-only">Üyeyi Kaldır</span>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<ConfirmDialog
				isOpen={!!memberToRemove}
				onClose={closeRemoveConfirmation}
				onConfirm={() => (memberToRemove ? handleRemoveMember(memberToRemove) : Promise.resolve())}
				title="Üyeyi Kaldır"
				description="Bu üyeyi projeden kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
				confirmText="Kaldır"
				cancelText="İptal"
				variant="destructive"
			/>
		</div>
	);
}
