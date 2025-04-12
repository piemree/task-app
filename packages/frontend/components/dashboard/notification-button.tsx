"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchNotifications, markNotificationsAsRead } from "@/lib/redux/slices/notificationSlice"

export function NotificationButton() {
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notifications)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      // In a real app, we would fetch notifications for the current project
      // For now, we'll just use a mock project ID
      dispatch(fetchNotifications("1"))
    }
  }, [user, isOpen, dispatch])

  const markAsRead = async () => {
    try {
      // In a real app, we would mark notifications as read for the current project
      await dispatch(markNotificationsAsRead("1")).unwrap()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "İşlem başarısız",
        description: "Bildirimler okundu olarak işaretlenemedi.",
      })
    }
  }

  const getNotificationText = (notification: any) => {
    switch (notification.action) {
      case "task_assigned":
        return `Size "${notification.task?.title}" görevi atandı.`
      case "task_status_changed":
        return `"${notification.task?.title}" görevinin durumu değiştirildi.`
      case "project_invitation":
        return `"${notification.project.name}" projesine davet edildiniz.`
      default:
        return `"${notification.project.name}" projesinde bir güncelleme var.`
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Bildirimler</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAsRead}>
              Tümünü okundu işaretle
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Yükleniyor...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>Bildirim yok</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification._id} className={notification.isRead ? "" : "font-medium bg-muted/50"}>
              <div className="flex flex-col gap-1">
                <span>{getNotificationText(notification)}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
