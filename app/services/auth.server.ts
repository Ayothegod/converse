import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

import { FormStrategy } from "remix-auth-form";

import prisma from "~/lib/db";

export let authenticator = new Authenticator(sessionStorage);

// create a user type for the seesion
// export let authenticator = new Authenticator<User>(sessionStorage);
try {
  authenticator.use(
    new FormStrategy(async ({ form, context }) => {
      // and also use `context` to access more things from the server
      let email: FormDataEntryValue | null = form.get("email");
      //   let username = form.get("username");
      let password = form.get("password");

      // You can validate the inputs however you want

      if (typeof email === "string" && typeof password === "string") {
        //hash password
        const hashedPassword = password;

        // And finally, you can find, or create, the user
        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          let user = await prisma.user.create({
            data: {
              email: email,
              hashedPassword: hashedPassword,
            },
          });
          return user;
        }

        return user;
      } else {
        // Handle the case when email is null or not a string
        console.log("error finding or creating user");
        return;
      }
    }),
    "user-pass"
  );
} catch (error) {
  console.log(error);
}
