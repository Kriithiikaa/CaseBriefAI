const KEY = "caresync_authed";

export const auth = {
  isLoggedIn: (): boolean =>
    typeof window !== "undefined" && localStorage.getItem(KEY) === "1",
  login: (): void => localStorage.setItem(KEY, "1"),
  logout: (): void => localStorage.removeItem(KEY),
};
