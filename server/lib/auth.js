import { Lucia } from "lucia";
import { adapter } from "./db.js";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
    getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	},
});

// IMPORTANT!
// declare module "lucia" {
// 	interface Register {
// 		Lucia: typeof lucia;
// 		DatabaseUserAttributes: DatabaseUserAttributes;
// 	}
// }

// interface DatabaseUserAttributes {
// 	username: string;
// }