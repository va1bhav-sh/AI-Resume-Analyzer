import { KeyRound, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import styles from "./LogoutLogin.module.css";

function LogoutLogin() {
  const { loginWithGoogle } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Login</h1>
            <KeyRound size={25} />
          </div>

         <button
  type="button"
  className={styles.closeButton}
  onClick={() => window.location.reload()}
  aria-label="Close"
>
  <X size={24} />
</button>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className={styles.spinner} size={20} />
              Signing in...
            </>
          ) : (
            <>
              <span className={styles.googleIcon}>G</span>
              Sign In with Google
            </>
          )}
        </button>

        {error && <p className={styles.error}>{error}</p>}

      </div>
    </div>
  );
}

export default LogoutLogin;