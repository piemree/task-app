"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, X } from "lucide-react"

type Member = {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
  }
  role: string
}

type ProjectMembersProps = {
  projectId: string
  members: Member[]
}

export function ProjectMembers({ projectId, members }: ProjectMembersProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("developer")
  const [isLoading, setIsLoading] = useState(false)
  const [projectMembers, setProjectMembers] = useState<Member[]>(members)

  const handleInvite = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      // Mock invite user
      const newMember = {
        _id: `m${projectMembers.length + 1}`,
        user: {
          _id: `u${projectMembers.length + 1}`,
          firstName: email.split("@")[0],
          lastName: "",
        },
        role,
      }

      setProjectMembers([...projectMembers, newMember])
      toast({
        title: "Davet gönderildi",
        description: `${email} adresine davet gönderildi.`,
      })
      setIsOpen(false)
      setEmail("")
      setRole("developer")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Davet gönderilemedi",
        description: "Kullanıcı davet edilirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      // Mock remove member
      setProjectMembers(projectMembers.filter((m) => m._id !== memberId))
      toast({
        title: "Üye kaldırıldı",
        description: "Üye projeden kaldırıldı.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Üye kaldırılamadı",
        description: "Üye kaldırılırken bir hata oluştu.",
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Proje Üyeleri</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Üye Davet Et
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Projeye Üye Davet Et</DialogTitle>
              <DialogDescription>Davet etmek istediğiniz kullanıcının e-posta adresini girin.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@sirket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Yönetici</SelectItem>
                    <SelectItem value="developer">Geliştirici</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleInvite} disabled={isLoading}>
                {isLoading ? "Gönderiliyor..." : "Davet Gönder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projectMembers.map((member) => (
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
              <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member._id)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Üyeyi Kaldır</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
