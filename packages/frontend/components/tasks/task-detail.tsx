"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { TaskLogs } from "@/components/tasks/task-logs"
import { CalendarDays, ArrowLeft, CheckCircle, Clock, Circle } from "lucide-react"

type Task = {
  _id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  project: string
  assignedTo: {
    _id: string
    firstName: string
    lastName: string
  }
  createdBy: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

export function TaskDetail({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTask()
  }, [projectId, taskId])

  const fetchTask = async () => {
    setLoading(true)
    try {
      // Mock task data
      const mockTask = {
        _id: "t1",
        title: "Tasarım Revizyonu",
        description:
          "Ana sayfa tasarımında revizyonlar yapılacak. Müşteri geri bildirimlerine göre header bölümü yeniden düzenlenecek ve renk paleti güncellenecek. Mobil görünüm için responsive tasarım iyileştirmeleri yapılacak.",
        status: "pending" as const,
        priority: "high" as const,
        project: "1",
        assignedTo: {
          _id: "u2",
          firstName: "Ayşe",
          lastName: "Yılmaz",
        },
        createdBy: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        createdAt: new Date().toISOString(),
      }

      setTask(mockTask)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Görev yüklenemedi",
        description: "Görev detayları yüklenirken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (status: "pending" | "in_progress" | "completed") => {
    if (!task) return

    try {
      // Mock status change
      setTask({ ...task, status })
      toast({
        title: "Durum güncellendi",
        description: "Görev durumu başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Durum güncellenemedi",
        description: "Görev durumu güncellenirken bir hata oluştu.",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek</Badge>
      case "medium":
        return <Badge variant="secondary">Orta</Badge>
      default:
        return <Badge variant="outline">Düşük</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Görev bulunamadı</h2>
        <p className="text-muted-foreground mt-2">İstediğiniz görev bulunamadı veya erişim izniniz yok.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push(`/dashboard/projects/${projectId}`)}>
          Projeye Dön
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/projects/${projectId}`)}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Geri</span>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{task.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              <CardTitle>Görev Detayları</CardTitle>
            </div>
            {getPriorityBadge(task.priority)}
          </div>
          <CardDescription className="mt-2">{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center text-sm">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{new Date(task.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Oluşturan:</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {`${task.createdBy.firstName[0] || ""}${task.createdBy.lastName[0] || ""}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {task.createdBy.firstName} {task.createdBy.lastName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Atanan:</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {`${task.assignedTo.firstName[0] || ""}${task.assignedTo.lastName[0] || ""}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Durumu Güncelle</h3>
            <div className="flex gap-2">
              <Button
                variant={task.status === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("pending")}
              >
                Beklemede
              </Button>
              <Button
                variant={task.status === "in_progress" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("in_progress")}
              >
                Devam Ediyor
              </Button>
              <Button
                variant={task.status === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("completed")}
              >
                Tamamlandı
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Görev Günlükleri</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="mt-4">
          <TaskLogs projectId={projectId} taskId={taskId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
