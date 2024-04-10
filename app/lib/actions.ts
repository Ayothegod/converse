import { json } from "@remix-run/node";
import prisma from "./db";
import { updateUserSessionData } from "./session";

type Error = {
  username?: string;
  password?: string;
};

interface UpdateResult {
  errors?: any;
  sessionData?: any;
  headers?: Headers;
}

// NOTE: error response
export const errorResponse = (body: string, status: number) => {
  throw new Response(body, {
    status: status,
  });
};

// NOTE: update Username
export const updateUsername = async (
  request: any,
  user: any,
  username: any
): Promise<UpdateResult> => {
  try {
    const errors: any = {};
    if (username.length < 6) {
      errors.username = "Username should be at least 6 characters";
    }
    if (username.length > 30) {
      errors.username = "Username should not be more than 30 characters";
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists) {
      errors.username = "This username already exist, please choose another";
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const addUsername = await prisma.user.update({
      where: {
        id: user?.userId,
      },
      data: {
        username: username,
      },
    });

    const { sessionData, headers } = await updateUserSessionData(
      request,
      user,
      username
    );
    return { sessionData, headers };
  } catch (error) {
    throw new Response("Username not updated! please try again", {
      status: 404,
    });
  }
};
