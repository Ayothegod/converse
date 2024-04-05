import { createThemeAction } from "remix-themes"
import { themeSessionResolver } from "~/services/themeSession.server"

export const action = createThemeAction(themeSessionResolver)
