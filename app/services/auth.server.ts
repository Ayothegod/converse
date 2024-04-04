import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import prisma from "~/lib/db";

export let authenticator = new Authenticator(sessionStorage, {
  sessionKey: "sessionKey", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
  throwOnError: true,
});

// create a user type for the seesion
// export let authenticator = new Authenticator<User>(sessionStorage);
try {
  authenticator.use(
    new FormStrategy(async ({ form, context }) => {
      let email = form.get("email") as string;
      let password = form.get("password") as string;

      // do some validation, errors are in the sessionErrorKey
      // TODO: make sure to do real validation and return the results to the broswer

      // You can validate the inputs however you want
      if (!email || email?.length === 0)
        throw new AuthorizationError("Bad Credentials: Email is required");
      if (typeof email !== "string")
        throw new AuthorizationError("Bad Credentials: Email must be a string");

      if (!password || password?.length === 0)
        throw new AuthorizationError("Bad Credentials: Password is required");
      if (typeof password !== "string")
        throw new AuthorizationError(
          "Bad Credentials: Password must be a string"
        );

      // login the user, this could be whatever process you want
      if (email && password) {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          // hash password
          console.log("start create user");

          const hashedPassword = await bcrypt.hash(password, 10);

          let user = await prisma.user.create({
            data: {
              email: email,
              hashedPassword: hashedPassword,
            },
          });

          console.log("end create user");
          return { userId: user?.id, user: user };
        }

        console.log("theres user");
        const passwordMatch = await bcrypt.compare(
          password,
          user?.hashedPassword as string
        );

        if (!passwordMatch) {
          throw new AuthorizationError("invalid email or password", {
            name: "invalidCredentials",
            message: "invalid email or password",
            cause: "invalidCredentials",
          });
          return null;
        }

        console.log("this user");
        return { userId: user?.id, user: user };
      } else {
        // if problem with user throw error AuthorizationError
        throw new AuthorizationError("Bad Credentials");
      }
    }),
    "user-pass"
  );
} catch (error) {
  throw new AuthorizationError("check your connection and try again!");
}
