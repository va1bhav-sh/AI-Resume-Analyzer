import { useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

function Login() {
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
    <div className={styles.loginOverlay}>
      <div className={styles.loginCard}>
        <div className={styles.titleRow}>
          <h1>Login</h1>
          <KeyRound size={25} />
        </div>

        <button
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

export default Login;