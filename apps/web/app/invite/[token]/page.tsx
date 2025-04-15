import { InviteAcceptPage } from "@/components/invite/invite-accept";

interface InvitePageProps {
	params: Promise<{
		token: string;
	}>;
}

export default async function InvitePage({ params }: InvitePageProps) {
	const { token } = await params;
	return <InviteAcceptPage token={token} />;
}
