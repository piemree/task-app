"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TaskLogResponse } from "@schemas/task-log.schema";
import { CalendarDays } from "lucide-react";

interface TaskLogsProps {
	taskLogs: TaskLogResponse[];
}

export function TaskLogs({ taskLogs }: TaskLogsProps) {
	const getLogMessage = (log: TaskLogResponse) => {
		switch (log.action) {
			case "created":
				return "Görevi oluşturdu";
			case "status_changed":
				return `Görev durumunu "${log.previousStatus}" durumundan "${log.newStatus}" durumuna değiştirdi`;
			case "priority_changed":
				return `Görev önceliğini "${log.previousPriority}" önceliğinden "${log.newPriority}" önceliğine değiştirdi`;
			case "assigned":
				return `Görevi ${log.previousAssignee?.firstName} ${log.previousAssignee?.lastName}'dan ${log.newAssignee?.firstName} ${log.newAssignee?.lastName}'a atadı`;
			case "updated":
				return "Görevi güncelledi";
			case "deleted":
				return "Görevi sildi";
			default:
				return "Görevde değişiklik yaptı";
		}
	};

	if (taskLogs.length === 0) {
		return (
			<Card>
				<CardContent className="p-6 text-center">
					<p className="text-muted-foreground">Bu görev için henüz günlük kaydı bulunmuyor.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="p-4">
				<ScrollArea className="h-[400px] pr-4">
					<div className="space-y-4">
						{taskLogs.map((log) => (
							<Card key={log._id} className="border shadow-sm">
								<CardContent className="p-4">
									<div className="flex items-start gap-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="text-xs">
												{`${log.changedBy.firstName[0] || ""}${log.changedBy.lastName[0] || ""}`.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<p className="font-medium">
													{log.changedBy.firstName} {log.changedBy.lastName}
												</p>
												<div className="flex items-center text-xs text-muted-foreground">
													<CalendarDays className="mr-1 h-3 w-3" />
													<span>{new Date(log.createdAt).toLocaleString("tr-TR")}</span>
												</div>
											</div>
											<p className="text-sm mt-1">{getLogMessage(log)}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
