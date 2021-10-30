import { createContext, useContext, useReducer, useEffect } from "react";
import { setAuthorizationHeader } from "api";
import jwtDecode from "jwt-decode";
import { useToast } from "@chakra-ui/react";

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
  const toast = useToast();
  return function login(token) {
    const { user } = jwtDecode(token);
    setUser({ token, role: user.role });
    localStorage.filmsToken = token;
    setAuthorizationHeader(token);
    toast({
      title: `Welcome back, ${user.role}`,
      status: "success",
      duration: 5000,
      isClosable: true,
})
  };
}

export function useLogout() {
  const toast = useToast();
  const setUser = useUserDispatch();
  return function () {
    setUser(initState);
    setAuthorizationHeader();
    delete localStorage.filmsToken;
    toast({
          title: 'You`ve logged out',
          status: "info",
          duration: 5000,
          isClosable: true,
    })
  };
}
