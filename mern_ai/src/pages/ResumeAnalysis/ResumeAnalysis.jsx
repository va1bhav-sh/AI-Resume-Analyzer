import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Lightbulb,
  Target,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

import styles from "./ResumeAnalysis.module.css";

function ResumeAnalysis() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user) {
        setLoading(false);
        setError("Please login to view this analysis.");
        return;
      }

      if (!id) {
        setLoading(false);
        setError("No analysis selected.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const idToken = await user.getIdToken();

        const response = await api.get(`/analysis/${id}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        console.log("Analysis details:", response.data);

        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error("Failed to fetch analysis:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [user, id]);

  if (loading) {
    return (
      <div className={styles.centerState}>
        <div className={styles.loadingIcon}>✨</div>
        <h2>Loading Analysis...</h2>
        <p>Please wait while we load your resume analysis.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerState}>
        <div className={styles.errorIcon}>!</div>
        <h2>Analysis Error</h2>
        <p>{error}</p>

        <button
          className={styles.backButton}
          onClick={() => navigate("/history")}
        >
          <ArrowLeft size={17} />
          Back to History
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.centerState}>
        <h2>No Analysis Found</h2>
        <button
          className={styles.backButton}
          onClick={() => navigate("/history")}
        >
          <ArrowLeft size={17} />
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className={styles.analysisPage}>

      {/* Header */}

      <div className={styles.pageHeader}>
        <div>
          <button
            className={styles.backLink}
            onClick={() => navigate("/history")}
          >
            <ArrowLeft size={17} />
            Back to History
          </button>

          <div className={styles.eyebrow}>
            <Target size={16} />
            Resume Insights
          </div>

          <h1>Resume Analysis</h1>

          <p>
            Detailed AI analysis of your resume against the selected job.
          </p>
        </div>
      </div>


      {/* Overview */}

      <div className={styles.overviewGrid}>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <FileText size={20} />
          </div>

          <div>
            <span>Resume</span>
            <strong>{analysis.resumeFileName}</strong>
          </div>
        </div>


        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Analyzed On</span>
            <strong>
              {new Date(analysis.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </strong>
          </div>
        </div>


        <div className={styles.scoreCard}>
          <div>
            <span>Match Score</span>
            <strong>{analysis.score}%</strong>
          </div>

          <div className={styles.scoreCircle}>
            <span>{analysis.score}</span>
            <small>%</small>
          </div>
        </div>

      </div>


      {/* Main Content */}

      <div className={styles.contentGrid}>

        {/* Left */}

        <div className={styles.leftColumn}>

          {/* Summary */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                ✨
              </div>

              <div>
                <h2>AI Summary</h2>
                <p>Overall assessment of your resume.</p>
              </div>
            </div>

            <p className={styles.summary}>
              {analysis.summary}
            </p>
          </section>


          {/* Strengths */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2>Strengths</h2>
                <p>Areas where your resume matches the role.</p>
              </div>
            </div>

            <ul className={styles.list}>
              {analysis.strengths?.map((strength, index) => (
                <li key={index}>
                  <CheckCircle2 size={17} />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>


          {/* Missing Skills */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.warningIcon}>
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2>Missing Skills</h2>
                <p>Skills or areas that could be improved.</p>
              </div>
            </div>

            {analysis.missingSkills?.length > 0 ? (
              <ul className={styles.list}>
                {analysis.missingSkills.map((skill, index) => (
                  <li key={index}>
                    <AlertTriangle size={17} />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyText}>
                No major missing skills were detected.
              </p>
            )}
          </section>


          {/* Suggestions */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.suggestionIcon}>
                <Lightbulb size={20} />
              </div>

              <div>
                <h2>AI Suggestions</h2>
                <p>Recommended improvements for your resume.</p>
              </div>
            </div>

            <ul className={styles.list}>
              {analysis.suggestions?.map((suggestion, index) => (
                <li key={index}>
                  <Lightbulb size={17} />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>


        {/* Right */}

        <aside className={styles.rightColumn}>

          <section className={styles.jobCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                📋
              </div>

              <div>
                <h2>Job Description</h2>
                <p>Position requirements used for analysis.</p>
              </div>
            </div>

            <div className={styles.jobDescription}>
              {analysis.jobDescription}
            </div>
          </section>

        </aside>

      </div>

    </div>
  );
}

export default ResumeAnalysis;