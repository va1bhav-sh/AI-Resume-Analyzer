import {
  Mail,
  ShieldCheck,
  LogOut,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import styles from "./Settings.module.css";

function Settings() {
  const { user, role, logout } = useAuth();

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const firstLetter =
    user?.displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className={styles.settingsPage}>

      {/* Header */}

      <div className={styles.header}>
        <h1>Settings</h1>

        <p>
          Manage your account settings.
        </p>
      </div>


      {/* Profile Card */}

      <section className={styles.card}>

        <div className={styles.cardHeader}>

          <div className={styles.iconBox}>
            <UserRound size={20} />
          </div>

          <div>
            <h2>Profile</h2>

            <p>
              Your account information
            </p>
          </div>

        </div>


        <div className={styles.profile}>

          <div className={styles.avatar}>

            <span className={styles.avatarLetter}>
              {firstLetter}
            </span>

            {user?.photoURL && !imageError && (
              <img
                src={user.photoURL}
                alt=""
                className={styles.avatarImage}
                onError={() =>
                  setImageError(true)
                }
              />
            )}

          </div>


          <div className={styles.profileInfo}>

            <h3>
              {user?.displayName || "User"}
            </h3>

            <div className={styles.email}>
              <Mail size={16} />

              <span>
                {user?.email ||
                  "No email available"}
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* Account Card */}

      <section className={styles.card}>

        <div className={styles.cardHeader}>

          <div className={styles.iconBox}>
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2>Account</h2>

            <p>
              Authentication and account status
            </p>
          </div>

        </div>


        {/* Sign-in method */}

        <div className={styles.accountRow}>

          <div>
            <strong>
              Sign-in method
            </strong>

            <span>
              Google
            </span>
          </div>

          <div className={styles.status}>
            <span></span>
            Active
          </div>

        </div>


        {/* Account role */}

        <div className={styles.accountRow}>

          <div>
            <strong>
              Account role
            </strong>

            <span>
              {role === "admin"
                ? "Administrator"
                : "User"}
            </span>
          </div>

          <div className={styles.status}>
            <span></span>
            {role === "admin"
              ? "Admin"
              : "User"}
          </div>

        </div>

      </section>


      {/* Logout */}

      <button
        type="button"
        className={styles.logoutButton}
        onClick={logout}
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  );
}

export default Settings;