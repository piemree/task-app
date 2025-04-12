import nodemailer, { type Transporter } from "nodemailer";
import config from "../config/config";

export class MailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: config.mailHost,
			port: config.mailPort,
			secure: true, // SSL için gerekli
			auth: {
				user: config.mailUser,
				pass: config.mailPass,
			},
		});
	}

	async sendMail(args: { to: string; subject: string; text: string }) {
		await this.transporter.sendMail({
			from: `"Project Management" <${config.mailUser}>`,
			to: args.to,
			subject: args.subject,
			text: args.text,
		});
	}
}
