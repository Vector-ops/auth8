import Joi from "joi";

const authSchema = Joi.object({
	username: Joi.string().alphanum().min(5).max(30).lowercase(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
		.required()
		.min(8),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net", "in"] },
		})
		.lowercase(),
})
	.with("username", "password")
	.with("email", "password")
	.xor("username", "email");

export default authSchema;
