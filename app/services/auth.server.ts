import bcrypt from "bcryptjs";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import prisma from "~/lib/db";
import { sessionStorage } from "~/services/session.server";

type User = {
  userId: string;
  userEmail: string;
  typeOfUser: string;
};

export let authenticator = new Authenticator<User | null>(sessionStorage, {
  sessionKey: "sessionKey", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
  throwOnError: true,
});

try {
  authenticator.use(
    new FormStrategy(async ({ form, context }) => {
      let email = form.get("email") as string;
      let password = form.get("password") as string;

      // TODO: make sure to do real validation and return the results to the broswer, errors are in the sessionErrorKey

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

          const userId: string = await user.id;
          const typeOfUser: string = "new_user";
          const userEmail: string | undefined = await user?.email;

          return { userId, userEmail, typeOfUser };
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

        const userId: string = await user?.id;
        const userEmail: string = await user?.email;
        const typeOfUser: string = "returning_user";

        return { userId, userEmail, typeOfUser };
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
