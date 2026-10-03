import {
  FileText,
  Mail,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const { user } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnalyses: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current logged-in user's email
  const currentUserEmail = user?.email;

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user) {
        setLoading(false);
        setError("Please login to access the admin dashboard.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const idToken = await user.getIdToken();

        const headers = {
          Authorization: `Bearer ${idToken}`,
        };

        const [
          analysesResponse,
          statsResponse,
          usersResponse,
        ] = await Promise.all([
          api.get("/admin/analyses", {
            headers,
          }),

          api.get("/admin/stats", {
            headers,
          }),

          api.get("/admin/users", {
            headers,
          }),
        ]);

        console.log(
          "Admin analyses:",
          analysesResponse.data
        );

        console.log(
          "Admin stats:",
          statsResponse.data
        );

        console.log(
          "Admin users:",
          usersResponse.data
        );

        setAnalyses(
          analysesResponse.data.analyses || []
        );

        setUsers(
          usersResponse.data.users || []
        );

        setStats(
          statsResponse.data.stats || {
            totalUsers: 0,
            totalAnalyses: 0,
            averageScore: 0,
          }
        );
      } catch (error) {
        console.error(
          "Failed to fetch admin data:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}? This will also delete their resume analyses.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const idToken = await user.getIdToken();

      const headers = {
        Authorization: `Bearer ${idToken}`,
      };

      // Delete user
      await api.delete(`/admin/users/${userId}`, {
        headers,
      });

      // Remove user from UI
      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser._id !== userId
        )
      );

      // Refresh analyses
      const analysesResponse = await api.get(
        "/admin/analyses",
        {
          headers,
        }
      );

      setAnalyses(
        analysesResponse.data.analyses || []
      );

      // Refresh stats
      const statsResponse = await api.get(
        "/admin/stats",
        {
          headers,
        }
      );

      setStats(
        statsResponse.data.stats || {
          totalUsers: 0,
          totalAnalyses: 0,
          averageScore: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.pageHeader}>
          <div className={styles.titleIcon}>
            <FileText size={21} />
          </div>

          <div>
            <div className={styles.eyebrow}>
              Administration
            </div>

            <h1>Resume Screening</h1>

            <p>
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.pageHeader}>
          <div className={styles.titleIcon}>
            <FileText size={21} />
          </div>

          <div>
            <div className={styles.eyebrow}>
              Administration
            </div>

            <h1>Resume Screening</h1>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>

      {/* Header */}

      <div className={styles.pageHeader}>
        <div className={styles.titleIcon}>
          <FileText size={21} />
        </div>

        <div>
          <div className={styles.eyebrow}>
            Administration
          </div>

          <h1>Resume Screening</h1>

          <p>
            Review candidate resume analyses and
            AI-generated insights.
          </p>
        </div>
      </div>


      {/* Admin Statistics */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <span>Total Users</span>

          <strong>
            {stats.totalUsers}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span>Total Analyses</span>

          <strong>
            {stats.totalAnalyses}
          </strong>
        </div>

        <div className={styles.statCard}>
          <span>Average Match Score</span>

          <strong>
            {Number(stats.averageScore).toFixed(1)}%
          </strong>
        </div>

      </div>


      {/* User Management */}

      <section className={styles.usersSection}>

        <div className={styles.sectionHeader}>
          <div>
            <h2>User Management</h2>

            <p>
              View users registered on the platform.
            </p>
          </div>
        </div>

        <div className={styles.usersTable}>

          {users.length === 0 ? (
            <p>
              No users found.
            </p>
          ) : (
            users.map((user) => (
              <div
                className={styles.userRow}
                key={user._id}
              >

                <div className={styles.userAvatar}>
                  {(user.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className={styles.userDetails}>

                  <strong>
                    {user.name || "Unknown User"}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                </div>

                <span className={styles.roleBadge}>
                  {user.role || "user"}
                </span>

                <span className={styles.userDate}>
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>

                <button
                  type="button"
                  className={
                    styles.deleteUserButton
                  }
                  onClick={() =>
                    handleDeleteUser(
                      user._id,
                      user.name || "this user"
                    )
                  }
                  disabled={
                    user.email ===
                    currentUserEmail
                  }
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </section>


      {/* Analysis Cards */}

      {analyses.length === 0 ? (
        <p>
          No resume analyses have been created yet.
        </p>
      ) : (
        <div className={styles.analysisGrid}>

          {analyses.map((analysis) => {

            const candidateName =
              analysis.userId?.name ||
              "Unknown User";

            const candidateEmail =
              analysis.userId?.email ||
              "No email";

            return (
              <article
                className={styles.analysisCard}
                key={analysis._id}
              >

                {/* Candidate */}

                <div className={styles.candidateHeader}>

                  <div className={styles.avatar}>
                    {candidateName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className={styles.candidateInfo}>

                    <h2>
                      {candidateName}
                    </h2>

                    <div className={styles.email}>
                      <Mail size={13} />
                      {candidateEmail}
                    </div>

                  </div>

                </div>


                {/* Score */}

                <div className={styles.scoreRow}>

                  <div className={styles.scoreCircle}>
                    <span>
                      {analysis.score}
                    </span>

                    <small>%</small>
                  </div>

                  <div>

                    <span
                      className={
                        styles.scoreLabel
                      }
                    >
                      Resume Match Score
                    </span>

                    <strong
                      className={
                        styles.scoreText
                      }
                    >
                      {analysis.score}%
                    </strong>

                  </div>

                </div>


                {/* Resume */}

                <div className={styles.resumeBox}>

                  <FileText size={16} />

                  <div>

                    <span>
                      Resume
                    </span>

                    <strong>
                      {analysis.resumeFileName}
                    </strong>

                  </div>

                </div>


                {/* AI Summary */}

                <div className={styles.summary}>

                  <div
                    className={
                      styles.summaryHeader
                    }
                  >
                    <TrendingUp size={15} />

                    <span>
                      AI Analysis
                    </span>
                  </div>

                  <p>
                    {analysis.summary}
                  </p>

                </div>


                {/* Date */}

                <div className={styles.date}>

                  <CalendarDays size={14} />

                  Analyzed{" "}

                  {new Date(
                    analysis.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;