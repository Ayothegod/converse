import { json } from "@remix-run/node";
import prisma from "./db";
import { updateUserSessionData, getUserSessionData } from "./session";

interface UpdateUsername {
  errors?: Error;
  sessionData?: any;
  headers?: Headers;
}

interface GenerateImage {
  errors?: Error;
  result?: any;
}

type Error = {
  username?: string;
  password?: string;
  image?: string;
  addUserInfo?: string;
  fullname?: string;
  bio?: string;
  punchline?: string;
};

// NOTE: error response
export const errorResponse = (body: string, status: number) => {
  throw new Response(body, {
    status: status,
  });
};

// NOTE: generateImage
export const addGeneratedRandomImage = async (
  request: any
): Promise<GenerateImage> => {
  try {
    const errors: Error = {};
    const { sessionData } = await getUserSessionData(request);
    const generatedImg = await process.env.RANDOMIMG_URL;
    const addImage = await prisma.user.update({
      where: { id: sessionData.userId },
      data: { defaultImageUrl: generatedImg },
      select: {
        defaultImageUrl: true,
        id: true,
      },
    });
    if (!addImage) {
      errors.image = "you can't skip right now, try again later!";
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    return { result: addImage };
  } catch (error) {
    throw new Response("Unable to generate image", {
      status: 500,
    });
  }
};

// NOTE: update Username
export const updateUsername = async (
  request: any,
  user: any,
  username: any
): Promise<UpdateUsername> => {
  try {
    const errors: Error = {};
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

interface AddUserDetails {
  errors?: Error;
  addUserInfo?: any;
}

export const addUserDetails = async (
  user: any,
  fullname?: any,
  punchline?: any,
  bio?: any
): Promise<AddUserDetails> => {
  try {
    const errors: Error = {};
    if (fullname && fullname.length < 6) {
      errors.fullname = "fullname should be at least 6 characters";
    }
    if (fullname && fullname.length > 100) {
      errors.fullname = "fullname should not be more than 100 characters";
    }
    if (punchline && punchline.length < 6) {
      errors.punchline = "punchline should be at least 6 characters";
    }
    if (bio && bio.length < 6) {
      errors.bio = "bio should be at least 6 characters";
    }
    if (bio && bio.length > 300) {
      errors.bio = "bio should not be more than 300 characters";
    }

    const generatedImg = await process.env.RANDOMIMG_URL;

    const addUserInfo = await prisma.user.update({
      where: {
        id: user?.userId,
      },
      data: {
        fullname: fullname || "",
        punchline: punchline || "",
        bio: bio || "",
        defaultImageUrl: generatedImg,
      },
    });
    if (!addUserInfo) {
      errors.addUserInfo = "add user details failed, try again later!";
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }
    return { addUserInfo };
  } catch (error) {
    throw new Response("Username not updated! please try again", {
      status: 404,
    });
  }
};
