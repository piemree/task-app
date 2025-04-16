import { InviteAcceptPage } from "@/components/invite/invite-accept";
import { projectService } from "@/services/project-service";
import type { IInviteTokenPayload } from "@api/types/token.types";
import { jwtDecode } from "jwt-decode";

interface InvitePageProps {
	params: Promise<{
		token: string;
	}>;
}

const fetchInitialData = async (token: string) => {
	try {
		const decoded = jwtDecode<IInviteTokenPayload>(token);
		const response = await projectService.acceptInvite({ inviteToken: token });
		return { decoded, response };
	} catch (error) {
		return { decoded: null, response: null };
	}
};

export default async function InvitePage({ params }: InvitePageProps) {
	const { token } = await params;
	const initialData = await fetchInitialData(token);

	if (!initialData.decoded || !initialData.response) {
		return <div>Invalid token</div>;
	}

	return (
		<InviteAcceptPage
			token={token}
			tokenPayload={initialData.decoded}
			needRegister={initialData.response.isUnRegistered}
			inviteSuccess={initialData.response.success}
		/>
	);
}
