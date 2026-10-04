import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tells the app whether the login overlay should appear
  const [showLogoutLogin, setShowLogoutLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setRole(null);
          setLoading(false);
          return;
        }

        try {
          const idToken = await currentUser.getIdToken();

          const response = await api.get("/users/me", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          setRole(response.data.user?.role || "user");
        } catch (error) {
          console.error(
            "Failed to fetch user role:",
            error
          );

          setRole(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      // Sync Firebase user with MongoDB
      await api.post(
        "/users/sync",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // Get the user's MongoDB role
      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setRole(response.data.user?.role || "user");

      setShowLogoutLogin(false);

      return result.user;
    } catch (error) {
      console.error(
        "Google login/sync error:",
        error
      );

      // Google login may have succeeded,
      // but backend sync may have failed.
      if (auth.currentUser) {
        await signOut(auth);
      }

      setUser(null);
      setRole(null);

      // Keep the login popup open
      setShowLogoutLogin(true);

      throw error;
    }
  };
  const openLogin = () => {
    setShowLogoutLogin(true);
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setRole(null);

      // User specifically logged out
      setShowLogoutLogin(true);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        showLogoutLogin,
        openLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}