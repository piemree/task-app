"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import type { ProjectMember, ProjectRole } from "@schemas/project.schema";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { InviteMemberDialog } from "./invite-member-dialog";

type ProjectMembersProps = {
	projectId: string;
	members: ProjectMember[];
};

export function ProjectMembers({ projectId, members }: ProjectMembersProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<ProjectRole>("developer");
	const [isLoading, setIsLoading] = useState(false);

	const handleInvite = async () => {
		if (!email || !projectId) return;

		setIsLoading(true);
		try {
			await projectService.inviteUser(projectId, {
				email,
				role: role as "admin" | "manager" | "developer",
			});
			toast({
				title: "Davet gönderildi",
				description: `${email} adresine davet gönderildi.`,
			});
			setIsOpen(false);
			setEmail("");
			setRole("developer");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Davet gönderilemedi",
				description: "Kullanıcı davet edilirken bir hata oluştu.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveMember = async (userId: string) => {
		if (!projectId) return;

		try {
			await projectService.removeMember(projectId, userId);
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
										{`${member.user.firstName[0] || ""}${member.user.lastName[0] || ""}`.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{member.user.firstName} {member.user.lastName}
									</p>
									<Badge variant={getRoleBadgeVariant(member.role)} className="mt-1">
										{member.role}
									</Badge>
								</div>
							</div>
							<Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.user._id)}>
								<X className="h-4 w-4" />
								<span className="sr-only">Üyeyi Kaldır</span>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
