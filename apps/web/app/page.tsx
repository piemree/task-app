import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	if (!token) {
		redirect("/auth/login");
	} else {
		redirect("/dashboard");
	}

	return null;
}
