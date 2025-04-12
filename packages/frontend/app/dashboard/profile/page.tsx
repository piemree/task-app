import type { Metadata } from "next"
import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Profil",
  description: "Kullanıcı profili",
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
      </div>
      <ProfileForm />
    </div>
  )
}
