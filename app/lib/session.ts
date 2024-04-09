import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";

// for actions
export const setUserSessionData = async (request: any, user: any) => {
  const session = await getSession(request.headers.get("cookie"));

  session.set(authenticator.sessionKey, user);

  const userCookie = await commitSession(session);
  const headers = new Headers({ "Set-Cookie": userCookie });

  return headers;
};

export const getUserSessionData = async (request: any) => {
  const session = await getSession(request.headers.get("Cookie"));

  const sessionData = (await session.get("sessionKey")) || null;

  const userCookie = await commitSession(session);
  const headers = new Headers({ "Set-Cookie": userCookie });

  return { sessionData, headers };
  //   const headers = await getUserSessionData(request)
  //   return json(null, { headers });
};

export const updateUserSessionData = async (
  request: any,
  user: any,
  username: string
) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.unset(authenticator.sessionKey);

  const newSessionBody = { ...user, username };

  session.set(authenticator.sessionKey, newSessionBody);

  const sessionData = (await session.get("sessionKey")) || null;

  const userCookie = await commitSession(session);
  const headers = new Headers({ "Set-Cookie": userCookie });

  return { sessionData, headers };
  //   const headers = await getUserSessionData(request)
  //   return json(null, { headers });
};
