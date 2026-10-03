import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import styles from "./SideBar.module.css";

function SideBar() {
  const { user, logout, isAdmin } = useAuth();

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const firstLetter =
    user?.displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Sparkles size={22} />
        </div>

        <div>
          <h2>ResumeAI</h2>
          <p>AI Career Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>

        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

    

        {/* History */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <History size={20} />
          <span>History</span>
        </NavLink>

        {/* Admin */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <ShieldCheck size={20} />
            <span>Admin</span>
          </NavLink>
        )}

      </nav>

      {/* Bottom section */}
      <div className={styles.bottomMenu}>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        {/* User */}
        <NavLink
          to="/settings"
          className={styles.user}
        >
          <div className={styles.avatar}>
            <span className={styles.avatarLetter}>
              {firstLetter}
            </span>

            {user?.photoURL && !imageError && (
              <img
                src={user.photoURL}
                alt=""
                className={styles.avatarImage}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div>
            <strong>{user?.displayName || "User"}</strong>
            <p>{user?.email || "Guest"}</p>
          </div>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          className={`${styles.navItem} ${styles.logout}`}
          onClick={logout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default SideBar;