import { createContext, useContext } from "react";
const userContext = createContext({
  user: null,
  setUser: () => {},
});
export default userContext;

export function useUserContext() {
  return useContext(userContext);
}
