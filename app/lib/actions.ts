import prisma from "./db";
import { updateUserSessionData } from "./session";

export const errorResponse = (body: string, status: number) => {
  throw new Response(body, {
    status: status,
  });
};

export const updateUsername = async (
  request: any,
  user: any,
  username: any
) => {
  try {
    // TODO: check is username exists
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists) {
      errorResponse("This username is not available", 401);
    }
    if (username.length < 6) {
      errorResponse("Username must be up to six characters", 401);
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
    throw new Response("Username ", {
      status: 404,
    });
    // Username not updated! please try again
  }
};
