import { StatusCodes } from "http-status-codes";
import config from "../config/config";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { Project } from "../models/project.model";
import { type IUser, User } from "../models/user.model";
import {
	type ProjectInput,
	type ProjectMember,
	type ProjectResponse,
	type ProjectRole,
	type UpdateProjectInput,
	userProjectRoleSchema,
} from "../schemas/project.schema";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";

export class ProjectService {
	private mailService: MailService;
	private tokenService: TokenService;

	constructor() {
		this.mailService = new MailService();
		this.tokenService = new TokenService();
	}

	private async findOneProject(args: { projectId?: string; userId?: string }): Promise<ProjectResponse> {
		const query = {};

		if (args.projectId) {
			Object.assign(query, { _id: args.projectId });
		}

		if (args.userId) {
			Object.assign(query, { members: { $elemMatch: { user: args.userId } } });
		}

		const project = await Project.findOne(query)
			.populate<{ owner: IUser }>({ path: "owner", select: "-password" })
			.populate<{ members: ProjectMember[] }>({
				path: "members.user",
				select: "-password",
			})
			.lean();

		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		return project;
	}

	private async findManyProjects(args: { userId?: string }): Promise<ProjectResponse[]> {
		const query = {};

		if (args.userId) {
			Object.assign(query, { members: { $elemMatch: { user: args.userId } } });
		}

		const projects = await Project.find(query)
			.populate<{ owner: IUser }>({ path: "owner", select: "-password" })
			.populate<{ members: ProjectMember[] }>({
				path: "members.user",
				select: "-password",
			})
			.lean();

		return projects;
	}

	async createProject(args: { data: ProjectInput; userId: string }): Promise<ProjectResponse> {
		const user = await User.findById(args.userId);
		if (!user) {
			throw new AppError(errorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
		}

		const project = await Project.create({
			name: args.data.name,
			description: args.data.description,
			owner: args.userId,
			members: [{ user: args.userId, role: userProjectRoleSchema.enum.admin }],
		});

		return this.findOneProject({ projectId: project._id });
	}

	async sendInvite(args: { projectId: string; email: string; role: ProjectRole }): Promise<{ inviteToken: string }> {
		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const token = this.tokenService.generateInviteToken({
			projectId: args.projectId,
			email: args.email,
			role: args.role,
		});

		const inviteLink = `${config.frontendUrl}/invite/${token}`;
		this.mailService.sendMail({
			to: args.email,
			subject: "Project Invitation",
			text: `You are invited to join the project ${project.name} as ${args.role} 
Please click the link below to accept the invitation:
Link: ${inviteLink}`,
		});

		return { inviteToken: token };
	}

	async acceptInvite(token: string): Promise<{ success: boolean; isUnRegistered: boolean }> {
		const payload = this.tokenService.verifyInviteToken(token);
		if (!payload) {
			throw new AppError(errorMessages.INVALID_TOKEN, 400);
		}

		const user = await User.findOne({ email: payload.email });
		if (!user) {
			return { success: false, isUnRegistered: true };
		}

		const project = await Project.findById(payload.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const isMemberAlready = project.members.some((member) => member.user.toString() === user._id.toString());
		if (isMemberAlready) {
			return { success: true, isUnRegistered: false };
		}

		project.members.push({ user: user._id, role: payload.role });
		await project.save();

		return { success: true, isUnRegistered: false };
	}

	async removeMember(args: { projectId: string; userId: string }): Promise<{ success: boolean }> {
		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		project.members = project.members.filter((member) => member.user.toString() !== args.userId);
		await project.save();

		return { success: true };
	}

	async updateProject(args: { data: UpdateProjectInput; projectId: string; userId: string }): Promise<ProjectResponse> {
		const updatedProject = await Project.findByIdAndUpdate(
			args.projectId,
			{
				name: args.data.name,
				description: args.data.description,
			},
			{ new: true },
		);

		if (!updatedProject) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		return this.findOneProject({ projectId: updatedProject._id });
	}

	async getProject(args: { projectId: string; userId: string }): Promise<ProjectResponse> {
		return this.findOneProject({ projectId: args.projectId, userId: args.userId });
	}

	async getProjects(userId: string): Promise<ProjectResponse[]> {
		return this.findManyProjects({ userId });
	}

	async deleteProject(projectId: string): Promise<{ success: boolean }> {
		await Project.findByIdAndDelete(projectId);

		return { success: true };
	}

	static async checkProjectAccess(args: { projectId: string; userId: string }) {
		const project = await Project.findOne({
			_id: args.projectId,
			members: { $elemMatch: { user: args.userId } },
		});

		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		return project;
	}

	static async checkProjectAccessByRole(args: { projectId: string; userId: string; roles?: ProjectRole[] }) {
		// find member and role
		const query: {
			_id: string;
			members: {
				$elemMatch: {
					user: string;
					role?: { $in: ProjectRole[] };
				};
			};
		} = {
			_id: args.projectId,
			members: { $elemMatch: { user: args.userId } },
		};

		if (args.roles && args.roles.length > 0) {
			query.members.$elemMatch.role = { $in: args.roles };
		}

		const project = await Project.findOne(query);

		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, StatusCodes.NOT_FOUND);
		}

		const memberRole = project.members.find((member) => member.user.toString() === args.userId)?.role;

		return memberRole;
	}
}
