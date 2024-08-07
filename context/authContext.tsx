import { backendFastApi } from "@/constants/constant";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type authProps = {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
  };
  onSignUp?: (username: string, password: string) => Promise<any>;
  onSignIn?: (username: string, password: string) => Promise<any>;
  onSignOut?: () => Promise<any>;
};

const tokenKey = "my-jwt";
const AuthContext = createContext<authProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(tokenKey);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      }
    })();
  }, []);

  const signUp = async (username: string, password: string) => {
    try {
      return await axios.post(`${backendFastApi}/user`, { username, password });
    } catch (error) {
      return { error: true, message: error as any };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const { data } = await axios.post(
        `${backendFastApi}/token`,
        { username, password },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (data.status) {
        setAuthState({ token: data.access_token, authenticated: true });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        await SecureStore.setItemAsync(tokenKey, data.access_token);
        return data;
      } else {
        return { error: true, message: "Password invalid" };
      }
    } catch (error) {
      return { error: true, message: error as any };
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(tokenKey);
    axios.defaults.headers.common["Authorization"] = "";
    setAuthState({ token: null, authenticated: false });
  };

  const value = {
    onSignUp: signUp,
    onSignIn: signIn,
    onSignOut: signOut,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
