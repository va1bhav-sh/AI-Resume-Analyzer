import { useNavigate } from "react-router-dom";
import {
  FileText,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import styles from "./History.module.css";

function History() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch analysis history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        setError("Please login to view your analysis history.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const idToken = await user.getIdToken();

        const response = await api.get("/analysis/history", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        console.log("History data:", response.data);

        setAnalyses(response.data.analyses || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load analysis history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);
  const handleDelete = async (analysisId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(analysisId);

      const idToken = await user.getIdToken();

      await api.delete(`/analysis/${analysisId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Remove the deleted analysis from the screen
      setAnalyses((currentAnalyses) =>
        currentAnalyses.filter(
          (analysis) => analysis._id !== analysisId
        )
      );
    } catch (error) {
      console.error("Failed to delete analysis:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete analysis."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.historyPage}>
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}>
            <TrendingUp size={16} />
            Resume Insights
          </div>

          <h1>Analysis History</h1>

          <p>
            Review your previous resume analyses and track your progress.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p>
          Loading analysis history...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p>
          {error}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && analyses.length === 0 && (
        <p>
          No analysis history found. Analyze a resume to see it here.
        </p>
      )}

      {/* Analysis cards */}
      {!loading && !error && analyses.length > 0 && (
        <div className={styles.historyGrid}>
          {analyses.map((analysis) => (
            <div
              className={styles.historyCard}
              key={analysis._id}
            >
              {/* Score */}
              <div className={styles.scoreSection}>
                <div className={styles.scoreCircle}>
                  <span>{analysis.score}</span>
                  <small>%</small>
                </div>
              </div>

              {/* Job */}
              <h2>Resume Match Analysis</h2>

              {/* Resume */}
              <div className={styles.resumeInfo}>
                <FileText size={16} />

                <div>
                  <span>Resume Name</span>

                  <strong>
                    {analysis.resumeFileName}
                  </strong>
                </div>
              </div>

              {/* Feedback */}
              <p className={styles.feedback}>
                {analysis.summary}
              </p>

              {/* Date */}
              <div className={styles.date}>
                <CalendarDays size={15} />

                <span>
                  {new Date(analysis.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* View */}
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() =>
                    navigate(`/resume-analysis/${analysis._id}`)
                  }
                >
                  View Analysis
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(analysis._id)}
                  disabled={deletingId === analysis._id}
                  aria-label="Delete analysis"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;