"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { ProjectResponse } from "@schemas/project.schema";
import { Folder, Plus, Users } from "lucide-react";
import Link from "next/link";

interface ProjectListProps {
	projects: ProjectResponse[];
}

export function ProjectList({ projects }: ProjectListProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{projects.map((project) => (
				<Card key={project._id} className="overflow-hidden">
					<CardHeader className="p-6">
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl">{project.name}</CardTitle>
							<Badge variant="outline">{project.members.length} members</Badge>
						</div>
						<CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
					</CardHeader>
					<CardContent className="p-6 pt-0">
						<div className="flex items-center text-sm text-muted-foreground">
							<Users className="mr-1 h-4 w-4" />
							<span>
								Created by {project.owner.firstName} {project.owner.lastName}
							</span>
						</div>
						<div className="text-sm text-muted-foreground mt-1">
							{formatDate(project.createdAt, { ignoreTime: true })}
						</div>
					</CardContent>
					<CardFooter className="p-6 pt-0">
						<Link href={`/dashboard/projects/${project._id}`} className="w-full">
							<Button variant="default" className="w-full">
								View Project
							</Button>
						</Link>
					</CardFooter>
				</Card>
			))}

			<Card className="overflow-hidden border-dashed">
				<CardHeader className="p-6">
					<CardTitle className="text-xl">New Project</CardTitle>
					<CardDescription className="mt-2">Click to create a new project</CardDescription>
				</CardHeader>
				<CardContent className="p-6 pt-0 flex items-center justify-center">
					<Folder className="h-16 w-16 text-muted-foreground" />
				</CardContent>
				<CardFooter className="p-6 pt-0">
					<Link href="/dashboard/projects/new" className="w-full">
						<Button variant="outline" className="w-full">
							<Plus className="mr-2 h-4 w-4" />
							Create Project
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
