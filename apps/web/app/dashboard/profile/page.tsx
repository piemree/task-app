import { ProfileForm } from "@/components/profile/profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "User profile",
};

export default function ProfilePage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Profile</h2>
			</div>
			<ProfileForm />
		</div>
	);
}
