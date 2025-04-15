import type { Metadata } from "next"
import { NewProjectForm } from "@/components/projects/new-project-form"

export const metadata: Metadata = {
  title: "Yeni Proje",
  description: "Yeni proje oluştur",
}

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Yeni Proje</h2>
      </div>
      <NewProjectForm />
    </div>
  )
}
