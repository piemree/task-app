import config from "../config/config";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import {
	type CreateProjectInput,
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

	async createProject(args: { data: CreateProjectInput; userId: string }) {
		const user = await User.findById(args.userId);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const project = await Project.create({
			name: args.data.name,
			description: args.data.description,
			owner: args.userId,
			members: [{ user: args.userId, role: userProjectRoleSchema.enum.admin }],
		});

		return project;
	}

	async sendInvite(args: { projectId: string; email: string; role: ProjectRole }) {
		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const token = this.tokenService.generateInviteToken({
			projectId: args.projectId,
			email: args.email,
			role: args.role,
		});

		const inviteLink = `${config.apiUrl}/api/projects/accept-invite/${token}`;
		const registerLink = `${config.frontendUrl}/register`;
		this.mailService.sendMail({
			to: args.email,
			subject: "Project Invitation",
			text: `
			You are invited to join the project ${project.name} as ${args.role}
			Please Register to Task App with the link below:
			Link: ${registerLink}
			Please click the link below to accept the invitation:
			Link: ${inviteLink}
			`,
		});

		return {
			message: "Invitation sent successfully",
		};
	}

	async acceptInvite(token: string) {
		const payload = this.tokenService.verifyInviteToken(token);
		if (!payload) {
			throw new AppError(errorMessages.INVALID_TOKEN, 400);
		}

		const user = await User.findOne({ email: payload.email });
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const project = await Project.findById(payload.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		project.members.push({ user: user._id, role: payload.role });
		await project.save();

		return project;
	}

	async removeMember(args: { projectId: string; userId: string }) {
		const project = await this.getProject(args);
		project.members = project.members.filter((member) => member.user.toString() !== args.userId);
		await project.save();

		return project;
	}

	async updateProject(args: { data: UpdateProjectInput; projectId: string; userId: string }) {
		const project = await this.getProject({ projectId: args.projectId, userId: args.userId });

		const user = await User.findById(args.userId);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		// just update the project name and description
		Object.assign(project, { name: args.data.name, description: args.data.description });
		await project.save();

		return project;
	}

	async getProject(args: { projectId: string; userId: string }) {
		const project = await Project.findOne({
			_id: args.projectId,
			members: { $elemMatch: { user: args.userId } },
		});
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		return project;
	}

	async getProjects(userId: string) {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}
		const projects = await Project.find({
			members: { $elemMatch: { user: userId } },
		});

		return projects;
	}

	async deleteProject(projectId: string) {
		await Project.findByIdAndDelete(projectId);

		return {
			message: "Project deleted successfully",
		};
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
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const memberRole = project.members.find((member) => member.user.toString() === args.userId)?.role;

		return memberRole;
	}
}
