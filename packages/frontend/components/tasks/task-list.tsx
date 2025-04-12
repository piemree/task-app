"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { CalendarDays, CheckCircle, Circle, Clock } from "lucide-react"

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

export function TaskList({ projectId }: { projectId: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      // Mock tasks data
      const mockTasks = [
        {
          _id: "t1",
          title: "Tasarım Revizyonu",
          description: "Ana sayfa tasarımında revizyonlar yapılacak",
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
        },
        {
          _id: "t2",
          title: "API Entegrasyonu",
          description: "Ödeme API'si entegrasyonu yapılacak",
          status: "in_progress" as const,
          priority: "medium" as const,
          project: "1",
          assignedTo: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          createdBy: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: "t3",
          title: "Test Senaryoları",
          description: "Ödeme modülü için test senaryoları yazılacak",
          status: "completed" as const,
          priority: "low" as const,
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
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]

      setTasks(mockTasks)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Görevler yüklenemedi",
        description: "Görevler yüklenirken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/dashboard/projects/${projectId}/tasks/${taskId}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
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
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Görev Bulunamadı</CardTitle>
          <CardDescription>Bu projede henüz görev bulunmuyor.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Yeni görev eklemek için "Görev Ekle" butonunu kullanabilirsiniz.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            Görev Ekle
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card
          key={task._id}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleTaskClick(task._id)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <CardTitle className="text-base">{task.title}</CardTitle>
              </div>
              {getPriorityBadge(task.priority)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardDescription className="line-clamp-2 mb-4">{task.description}</CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-1 h-4 w-4" />
                <span>{new Date(task.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Atanan:</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {`${task.assignedTo.firstName[0] || ""}${task.assignedTo.lastName[0] || ""}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
