"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext({
  isLoggedIn: true,
  onLogout: () => {},
  onLogin: () => {},
  error: {},
  token: "",
  role: "",
  name: "",
  loading: false,
});

export const AuthContextProvider = (props) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(undefined);
  const [token, setToken] = useState(props.token || "");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const expiryDate = localStorage.getItem("expiryDate");
    if (expiryDate && new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    if (token !== "") {
      getUserData();
      setIsLoggedIn(true);
    }
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API + "userdata", {
        withCredentials: true,
      });

      const data = await response.data;
      setName(data.user.name);
      setRole(data.user.role);
      // console.log(data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else if (error.response.status === 500) {
          alert("Something went wrong");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
  };

  const logoutHandler = async () => {
    if (token !== "") {
      try {
        await axios.delete(process.env.NEXT_PUBLIC_API + "auth/logout", {
          withCredentials: true,
        });
        router.push("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            router.push("/login");
          } else if (error.response.status === 500) {
            alert("Something went wrong");
          }
        } else if (error.request) {
          console.error("No response received from server. It might be down.");
          alert("Cannot connect to the server. It might be down.");
        }
      }
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    setIsLoggedIn(false);
    setToken("");
  };

  const loginHandler = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + "auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setError(undefined);
      setName(response.data.name);
      setRole(response.data.role);
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setIsLoggedIn(true);
      localStorage.setItem("userId", response.data.userId);
      const remainingMilliSecond = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliSecond);
      localStorage.setItem("expiryDate", expiryDate);
      setAutoLogout(remainingMilliSecond);
      router.push("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else if (error.response.status === 500) {
          alert("Something went wrong");
        }
        setError(error.response.data);
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
    setLoading(false);
  };

  const setAutoLogout = (milisecond) => {
    setTimeout(() => {
      logoutHandler();
    }, milisecond);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        error,
        token,
        role,
        name,
        loading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
