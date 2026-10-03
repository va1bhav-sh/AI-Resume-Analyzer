import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

import styles from "./Dashboard.module.css";
import ResumeUpload from "../../component/ResumeUpload/ResumeUpload";
import api from "../../api/api";

function Dashboard() {
  const { user } = useAuth();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [resume, setResume] = useState(null);

  // Store the job description entered by the user
  const [jobDescription, setJobDescription] = useState("");

  // If Google profile image fails, show the user's initial instead.
  const [imageError, setImageError] = useState(false);

  const handleAnalyze = async () => {
    // Make sure a resume has been uploaded
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (!resume) {
      alert("Please upload your resume first.");
      return;
    }

    // Make sure job description is entered
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setResult(null);



      // Send resume text + job description to backend
      const idToken = await user.getIdToken();
      console.log("ID TOKEN:", idToken);

      const response = await api.post(
        "/cohere/analyze",
        {
          resumeText: resume.text,
          jobDescription: jobDescription,
          resumeFileName: resume.file.name,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );




      console.log("AI Analysis Response:", response.data);

      setResult(response.data.analysis);

    } catch (error) {
      console.error("AI analysis failed:", error);

      alert("AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };


  const userInitial =
    user?.displayName?.charAt(0)?.toUpperCase() || "U";

  /*
   * Firebase normally provides the Google profile photo through
   * user.photoURL. We also check providerData as a fallback.
   */
  const googleProvider = user?.providerData?.find(
    (provider) => provider.providerId === "google.com"
  );

  const profilePhoto =
    user?.photoURL || googleProvider?.photoURL || "";

  return (
    <div className={styles.dashboard}>

      {/* =========================
          MAIN ANALYSIS SECTION
      ========================= */}


      <section className={styles.mainSection}>

        <p className={styles.subtitle}>
          Smart Resume Screening
        </p>

        <h1>Resume Match Score</h1>


        {/* =========================
            INSTRUCTIONS
        ========================= */}

        <div className={styles.instructions}>

          <h3>🔔 Important Instructions:</h3>

          <p>
            📄 Please paste the complete job description in the
            "Job Description" field before submitting.
          </p>

          <p>
            📎 Only PDF format (.pdf) resumes are accepted.
          </p>

        </div>


        {/* =========================
            RESUME UPLOAD
        ========================= */}

        <ResumeUpload onFileSelect={setResume} />


        {/* =========================
            JOB DESCRIPTION
        ========================= */}

        <div className={styles.analysisRow}>

          <textarea
            className={styles.jobDescription}
            placeholder="Paste Your Job Description"
            value={jobDescription}
            onChange={(event) =>
              setJobDescription(event.target.value)
            }
          />

          <button
            className={styles.analyzeButton}
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Processing..." : "Analyze"}
          </button>

        </div>


        {/* =========================
            WHAT YOU'LL GET
        ========================= */}

        {/* =========================
    AI INSIGHTS
========================= */}

        <div className={styles.featuresSection}>

          <div className={styles.featuresHeader}>
            <h3>AI Insights</h3>

            <p>
              Key insights from your resume analysis.
            </p>
          </div>


          <div className={styles.featureCards}>

            {/* =========================
        MATCH SCORE
    ========================= */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                ✨
              </div>

              <div className={styles.featureContent}>

                <h4>Match Score</h4>

                {result ? (
                  <>
                    <strong className={styles.featureValue}>
                      {result.score}%
                    </strong>

                    <p>
                      Resume-job compatibility score.
                    </p>
                  </>
                ) : (
                  <p>
                    AI will calculate how closely your
                    resume matches the job.
                  </p>
                )}

              </div>

            </div>


            {/* =========================
        MISSING SKILLS
    ========================= */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                🎯
              </div>

              <div className={styles.featureContent}>

                <h4>Missing Skills</h4>

                {result ? (
                  <>
                    <strong className={styles.featureValue}>
                      {result.missingSkills?.length || 0}
                    </strong>

                    <p>
                      {result.missingSkills?.length === 0
                        ? "No major skill gaps detected."
                        : "Skills identified by AI."}
                    </p>
                  </>
                ) : (
                  <p>
                    AI will identify important skills
                    missing from your resume.
                  </p>
                )}

              </div>

            </div>


            {/* =========================
        AI SUGGESTIONS
    ========================= */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                💡
              </div>

              <div className={styles.featureContent}>

                <h4>AI Suggestions</h4>

                {result ? (
                  <>
                    <strong className={styles.featureValue}>
                      {result.suggestions?.length || 0}
                    </strong>

                    <p>
                      Personalized improvements generated by AI.
                    </p>
                  </>
                ) : (
                  <p>
                    AI will provide personalized
                    recommendations for your resume.
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          RIGHT SIDE
      ========================= */}

      <aside className={styles.rightSection}>


        {/* =========================
            USER PROFILE
        ========================= */}

        <div className={styles.profileCard}>

          <h2>Analyze With AI</h2>

          <div className={styles.profileAvatar}>

            {profilePhoto && !imageError ? (

              <img
                src={profilePhoto}
                alt=""
                className={styles.profileImage}
                referrerPolicy="no-referrer"
                onError={() => {
                  setImageError(true);
                }}
              />

            ) : (

              userInitial

            )}

          </div>

          <h3>
            {user?.displayName || "User"}
          </h3>

        </div>


        {/* =========================
            AI RESULT
        ========================= */}

        <div className={styles.resultCard}>

          {isAnalyzing ? (

            /* =========================
               PROCESSING
            ========================= */

            <div className={styles.processing}>

              <div className={styles.spinner}>
                ✨
              </div>

              <h2>Analyzing Resume</h2>

              <p>
                AI is processing your resume and comparing it
                with the job description.
              </p>

              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>

          ) : result ? (

            /* =========================
               RESULT
            ========================= */

            <div className={styles.result}>

              <h2>Result</h2>


              {/* Score */}

              <div className={styles.score}>

                <span>
                  {result.score}%
                </span>

                <div className={styles.scoreBars}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>


              {/* Summary */}

              <h3>Summary</h3>

              <p>
                {result.summary}
              </p>


              {/* Strengths */}

              <h3>Strengths</h3>

              <ul>
                {result.strengths?.map((strength, index) => (
                  <li key={index}>
                    {strength}
                  </li>
                ))}
              </ul>


              {/* Missing Skills */}

              <h3>Missing Skills</h3>

              <ul>
                {result.missingSkills?.map((skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                ))}
              </ul>


              {/* Suggestions */}

              <h3>Suggestions</h3>

              <ul>
                {result.suggestions?.map((suggestion, index) => (
                  <li key={index}>
                    {suggestion}
                  </li>
                ))}
              </ul>

            </div>

          ) : (

            /* =========================
               READY STATE
            ========================= */

            <div className={styles.readyState}>

              <div className={styles.readyIcon}>
                ✨
              </div>

              <h2>Ready to Analyze</h2>

              <p>
                Upload your resume and add a job description
                to start your AI analysis.
              </p>

            </div>

          )}

        </div>

      </aside>

    </div>
  );
}

export default Dashboard;