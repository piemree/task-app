"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { CalendarDays } from "lucide-react"

type TaskLog = {
  _id: string
  task: string
  action: string
  previousStatus?: string
  newStatus?: string
  previousPriority?: string
  newPriority?: string
  previousAssignee?: {
    _id: string
    firstName: string
    lastName: string
  }
  newAssignee?: {
    _id: string
    firstName: string
    lastName: string
  }
  changedBy: {
    _id: string
    firstName: string
    lastName: string
  }
  changes: {
    title?: string
    description?: string
    status?: string
    priority?: string
    assignedTo?: string
  }
  createdAt: string
}

export function TaskLogs({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<TaskLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [projectId, taskId])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      // Mock logs data
      const mockLogs = [
        {
          _id: "l1",
          task: "t1",
          action: "task_created",
          changedBy: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          changes: {},
          createdAt: new Date().toISOString(),
        },
        {
          _id: "l2",
          task: "t1",
          action: "status_changed",
          previousStatus: "pending",
          newStatus: "in_progress",
          changedBy: {
            _id: "u2",
            firstName: "Ayşe",
            lastName: "Yılmaz",
          },
          changes: {
            status: "in_progress",
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "l3",
          task: "t1",
          action: "assignee_changed",
          previousAssignee: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          newAssignee: {
            _id: "u2",
            firstName: "Ayşe",
            lastName: "Yılmaz",
          },
          changedBy: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          changes: {
            assignedTo: "u2",
          },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ]

      setLogs(mockLogs)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Günlükler yüklenemedi",
        description: "Görev günlükleri yüklenirken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getLogMessage = (log: TaskLog) => {
    switch (log.action) {
      case "task_created":
        return "Görevi oluşturdu"
      case "status_changed":
        return `Görev durumunu "${log.previousStatus}" durumundan "${log.newStatus}" durumuna değiştirdi`
      case "priority_changed":
        return `Görev önceliğini "${log.previousPriority}" önceliğinden "${log.newPriority}" önceliğine değiştirdi`
      case "assignee_changed":
        return `Görevi ${log.previousAssignee?.firstName} ${log.previousAssignee?.lastName}'dan ${log.newAssignee?.firstName} ${log.newAssignee?.lastName}'a atadı`
      case "task_updated":
        return "Görevi güncelledi"
      default:
        return "Görevde değişiklik yaptı"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Bu görev için henüz günlük kaydı bulunmuyor.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log._id}>
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
  )
}
