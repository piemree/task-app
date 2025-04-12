import type { Metadata } from "next"
import { ProjectList } from "@/components/projects/project-list"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Proje yönetimi dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projelerim</h2>
      </div>
      <ProjectList />
    </div>
  )
}
