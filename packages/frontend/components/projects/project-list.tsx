"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Folder, Users } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProjects } from "@/lib/redux/slices/projectSlice"

export function ProjectList() {
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { projects, isLoading, error } = useAppSelector((state) => state.projects)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleCreateProject = () => {
    router.push("/dashboard/projects/new")
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-6">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Hata",
      description: error,
    })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project._id} className="overflow-hidden">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <Badge variant="outline">{project.members.length} üye</Badge>
            </div>
            <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>
                {project.owner.firstName} {project.owner.lastName} tarafından oluşturuldu
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {new Date(project.createdAt).toLocaleDateString("tr-TR")}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button variant="default" className="w-full" onClick={() => handleProjectClick(project._id)}>
              Projeyi Görüntüle
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Card className="overflow-hidden border-dashed">
        <CardHeader className="p-6">
          <CardTitle className="text-xl">Yeni Proje</CardTitle>
          <CardDescription className="mt-2">Yeni bir proje oluşturmak için tıklayın</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex items-center justify-center">
          <Folder className="h-16 w-16 text-muted-foreground" />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button variant="outline" className="w-full" onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Proje Oluştur
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
