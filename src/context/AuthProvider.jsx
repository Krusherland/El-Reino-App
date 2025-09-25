import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { Global } from "../helpers/Global";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({});

  useEffect(() => {
    authedUser();
  }, []);

  const authedUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      setLoading(false);
      return false;
    }
    
    try {
      // Fetch user profile
      const request = await fetch(Global.url + "user/profile/" + user.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();
      
      if (data.status === "success") {
        setAuth(data.user);
        
        // Only fetch counters if user profile was successful
        try {
          const requestCounters = await fetch(Global.url + "user/counters/" + user.id, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          const countersData = await requestCounters.json();
          
          if (countersData.status === "success") {
            setCounters(countersData);
          } else {
            // Set default counters if request fails
            setCounters({ following: 0, followed: 0, publications: 0 });
          }
        } catch (error) {
          console.error("Error fetching counters:", error);
          setCounters({ following: 0, followed: 0, publications: 0 });
        }
      } else {
        setAuth({});
        setCounters({});
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAuth({});
      setCounters({});
    }
    
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, authedUser, loading, counters, setCounters }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
