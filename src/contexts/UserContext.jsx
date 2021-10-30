import { createContext, useContext, useReducer, useEffect } from "react";
import { setAuthorizationHeader } from "api";
import jwtDecode from "jwt-decode";

const initState = {
  token: null,
  role: "user",
};

const reducer = (s, v) => ({ ...s, ...v });

const UserStateContext = createContext();
const UserDispatchContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useReducer(reducer, initState);

  useEffect(() => {
    if (localStorage.filmsToken) {
      const { user } = jwtDecode(localStorage.filmsToken);
      setUser({
        token: localStorage.filmsToken,
        role: user.role,
      });
      setAuthorizationHeader(localStorage.filmsToken);
    }
  }, []);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const user = useContext(UserStateContext);
  if (!user) {
    throw Error("useUserState must be invoked within UserProvider");
  }
  return user;
}

export function useUserDispatch() {
  const setUser = useContext(UserDispatchContext);
  if (!setUser) {
    throw Error("useUserDispatch must be invoked within UserProvider");
  }
  return setUser;
}

export function useLogin() {
  const setUser = useUserDispatch();
  return function login(token) {
    const { user } = jwtDecode(token);
    setUser({ token, role: user.role });
    localStorage.filmsToken = token;
    setAuthorizationHeader(token);
  };
}

export function useLogout() {
  const setUser = useUserDispatch();
  return function () {
    setUser(initState);
    setAuthorizationHeader();
    delete localStorage.filmsToken;
  };
}
