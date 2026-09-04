import { useEffect, useRef, useState } from "react";
import "./App.css";

import { getSurvey } from "./firebase/surveys";
import { submitSurvey } from "./firebase/responses";

import {
  recordVisit,
  getAnalyticsVisits,
  getUniqueVisitors,
} from "./firebase/analytics";

/* =========================================================
   DESTINATIONS
========================================================= */

const DESTINATIONS = [
  {
    number: "01",
    id: "rizal-shrine-visitor-center",
    title: "Rizal Shrine Visitor Center",
    description:
      "📍Barangay Talisay, Dapitan City",
    image: "/Rizal_Shrine.jpg",
  },
  {
    number: "02",
    id: "rizal-casa-cuadrada",
    title: "Rizal Casa Cuadrada",
    description:
      "📍Barangay Talisay, Dapitan City",
    image: "/Casa_Cuadrada.jpg",
  },
  {
    number: "03",
    id: "casa-residencia-rizal-shrine",
    title: "Casa Residencia Rizal Shrine",
    description:
      "📍Barangay Talisay, Dapitan City",
    image: "/casa_residencia.jpg",
  },
  {
    number: "04",
    id: "dapitan-city-plaza",
    title: "Dapitan City Plaza",
    description:
      "📍Justice Florentino Saguin St. Dapitan City, Zamboanga del Norte.",
    image: "/Dapitan_City_Plaza.jpg",
  },
  {
    number: "05",
    id: "relief-map",
    title: "Relief Map",
    description:
      "📍Justice Florentino Saguin St. Dapitan City, Zamboanga del Norte.",
    image: "/Relief_Map.jpg",
  },
  {
    number: "06",
    id: "balay-hamoy-museum",
    title: "Balay Hamoy Museum",
    description:
      "📍143 M1 Retro Street, Dapitan City.",
    image: "/Balay_Hamoy.jpg",
  },
  {
    number: "07",
    id: "punto-del-desembarco",
    title: "Punto del Desembarco",
    description:
      "📍Sunset Boulevard, Dapitan City.",
    image: "/Rizal_Gwapo.jpg",
  },
  {
    number: "08",
    id: "Aniano Adasa Ancestral House",
    title: "Aniano Adasa Ancestral House",
    description:
      "📍Josephine Bracken Street, Dapitan City.",
    image: "/Aniano.jpg",
  },
  {
    number: "09",
    id: "ST. James the Greater Parish Church",
    title: "ST. James the Greater Parish Church",
    description:
      "📍Justice Florentino Saguin St. Dapitan City, Zamboanga del Norte.",
    image: "/ST.JAMES.jpg",
  },
];

/* =========================================================
   FACEBOOK SETTINGS
========================================================= */

const FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61593956825123&rdid=ixx95FXiiUmm6195&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DoWju6Qhk%2F#";

const REQUIRED_HASHTAG = "#DapitanChallenge";

/* =========================================================
   APP
========================================================= */

function App() {
  const [screen, setScreen] = useState("warning");

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined"
      ? navigator.onLine
      : true
  );

  const [survey, setSurvey] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(true);
  const [surveyError, setSurveyError] = useState(null);

  const [showAnalytics, setShowAnalytics] =
    useState(false);

  /* =======================================================
     LOAD SURVEY + ONLINE STATUS
  ======================================================= */

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    loadSurvey();

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  /* =======================================================
     LOAD SURVEY
  ======================================================= */

  const loadSurvey = async () => {
    try {
      setSurveyLoading(true);
      setSurveyError(null);

      const data =
        await getSurvey("dapitan-main");

      console.log(
        "Survey loaded:",
        data
      );

      setSurvey(data);
    } catch (error) {
      console.error(
        "Failed to load survey:",
        error
      );

      setSurveyError(
        error?.message ||
          "Unable to load survey."
      );
    } finally {
      setSurveyLoading(false);
    }
  };

  /* =======================================================
     WARNING → MECHANICS
  ======================================================= */

  const continueToExperience = () => {
    setScreen("mechanics");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     MECHANICS → EXPERIENCE
  ======================================================= */

  const startExperience = async () => {
    const nextScreen =
      isOnline
        ? "online"
        : "offline";

    setScreen(nextScreen);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    /* =====================================================
       RECORD ANALYTICS VISIT

       Only record visits when online.
       recordVisit() is protected with try/catch so
       analytics never prevents the actual app from opening.
    ===================================================== */

    if (isOnline) {
      try {
        await recordVisit();
        console.log(
          "Analytics visit recorded."
        );
      } catch (error) {
        console.error(
          "Failed to record analytics visit:",
          error
        );
      }
    }
  };

  /* =======================================================
     WARNING
  ======================================================= */

  if (screen === "warning") {
    return (
      <main className="app">
        <section className="warning-screen">

          <div className="brand">
            Discover
            <span>Dapitan</span>
          </div>

          <div className="warning-icon">
            !
          </div>

          <p className="section-label">
            BEFORE YOU PROCEED
          </p>

          <h1>
            Are You Ready
            <br />
            for the Challenge?
          </h1>

          <p className="intro-text">
            Discover Dapitan City experience.
            Before proceeding, please read the
            challenge mechanics.
          </p>

          <div className="warning-message">

            <strong>
              ⚠ Important Notice
            </strong>

            <p>
              This experience contains interactive
              activities, photo proof requirements,
              Facebook verification, and survey
              questions.
            </p>

          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              continueToExperience
            }
          >
            YES, PROCEED
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setScreen("exit")
            }
          >
            NO, EXIT
          </button>

          <div className="live-status">

            <span
              className={
                isOnline
                  ? "status-dot online"
                  : "status-dot"
              }
            />

            {isOnline
              ? "Online experience available"
              : "Offline mode available"}

          </div>

        </section>
      </main>
    );
  }

  /* =======================================================
     EXIT
  ======================================================= */

  if (screen === "exit") {
    return (
      <main className="app">
        <section className="simple-screen">

          <div className="exit-icon">
            ✓
          </div>

          <h1>
            Thank You
          </h1>

          <p>
            You have chosen not to continue
            with the tourism challenge.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              setScreen("warning")
            }
          >
            GO BACK
          </button>

        </section>
      </main>
    );
  }

  /* =======================================================
     ANALYTICS PAGE
  ======================================================= */

  if (showAnalytics) {
    return (
      <AnalyticsDashboard
        onBack={() =>
          setShowAnalytics(false)
        }
      />
    );
  }

  /* =======================================================
     MECHANICS
  ======================================================= */

  if (screen === "mechanics") {
    return (
      <main className="app">

        <section className="mechanics-screen">

          <p className="section-label">
            CHALLENGE MECHANICS
          </p>

          <h1>
            Discover
            <br />
            Dapitan
          </h1>

          <p className="intro-text">
            Choose one destination, complete
            the selfie challenge, publish your
            proof on Facebook, then submit the
            required screenshot before taking
            the survey.
          </p>

          <div className="mechanic-list">

            <div className="mechanic">

              <span>
                01
              </span>

              <div>

                <strong>
                  Choose
                </strong>

                <p>
                  Select exactly one tourist
                  destination from the available
                  locations.
                </p>

              </div>

            </div>

            <div className="mechanic">

              <span>
                02
              </span>

              <div>

                <strong>
                  Take 1 Selfie
                </strong>

                <p>
                  Take one clear selfie at your
                  chosen destination showing your
                  face and the tourist attraction
                  or recognizable background.
                </p>

              </div>

            </div>

            <div className="mechanic">

              <span>
                03
              </span>

              <div>

                <strong>
                  Post Your Proof
                </strong>

                <p>
                  Follow the Facebook challenge
                  instructions and make sure the
                  required hashtag is visible.
                </p>

              </div>

            </div>

            <div className="mechanic">

              <span>
                04
              </span>

              <div>

                <strong>
                  Submit Screenshot
                </strong>

                <p>
                  Upload a screenshot showing
                  your Facebook proof and required
                  hashtag.
                </p>

              </div>

            </div>

            <div className="mechanic">

              <span>
                05
              </span>

              <div>

                <strong>
                  Complete Survey
                </strong>

                <p>
                  Once the challenge is completed,
                  continue to the tourism survey.
                </p>

              </div>

            </div>

          </div>

          <div className="mode-preview">

            <span
              className={
                isOnline
                  ? "status-dot online"
                  : "status-dot"
              }
            />

            <div>

              <strong>
                {isOnline
                  ? "ONLINE MODE"
                  : "OFFLINE MODE"}
              </strong>

              <p>
                {isOnline
                  ? "Interactive challenge and Facebook proof enabled."
                  : "Challenge information remains available offline. Facebook requires internet access."}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              startExperience
            }
          >
            START CHALLENGE →
          </button>

        </section>

      </main>
    );
  }

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  if (screen === "offline") {
    return (
      <OfflineExperience
        onBack={() =>
          setScreen("warning")
        }
        survey={survey}
        surveyLoading={
          surveyLoading
        }
        surveyError={
          surveyError
        }
        onOpenAnalytics={() =>
          setShowAnalytics(true)
        }
      />
    );
  }

  return (
    <OnlineExperience
      onBack={() =>
        setScreen("warning")
      }
      survey={survey}
      surveyLoading={
        surveyLoading
      }
      surveyError={
        surveyError
      }
      onOpenAnalytics={() =>
        setShowAnalytics(true)
      }
    />
  );
}

/* =========================================================
   EXPERIENCE COMPONENT
========================================================= */

function ExperiencePage({
  onBack,
  survey,
  surveyLoading,
  surveyError,
  mode,
  onOpenAnalytics,
}) {
  const [selectedDestination, setSelectedDestination] =
    useState(null);

  const [showChallenge, setShowChallenge] =
    useState(false);

  const [selfies, setSelfies] =
    useState([]);

  const [facebookProof, setFacebookProof] =
    useState(null);

  const [challengeComplete, setChallengeComplete] =
    useState(false);

  const [showSurvey, setShowSurvey] =
    useState(false);

  const selectedDestinationRef =
    useRef(null);

  const challengeRef =
    useRef(null);

  /* =======================================================
     SELECT DESTINATION
  ======================================================= */

  const handleDestinationSelect =
    (destination) => {

      const isSameDestination =
        selectedDestination?.id ===
        destination.id;

      if (isSameDestination) {

        setTimeout(() => {

          selectedDestinationRef.current
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

        }, 100);

        return;
      }

      setSelectedDestination(
        destination
      );

      setShowChallenge(false);
      setSelfies([]);
      setFacebookProof(null);
      setChallengeComplete(false);
      setShowSurvey(false);

      setTimeout(() => {

        selectedDestinationRef.current
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

      }, 180);
    };

  /* =======================================================
     START SELFIE CHALLENGE
  ======================================================= */

  const handleStartChallenge = () => {

    if (!selectedDestination) {
      return;
    }

    setShowChallenge(true);

    setTimeout(() => {

      challengeRef.current
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    }, 180);
  };

  /* =======================================================
     CHANGE DESTINATION
  ======================================================= */

  const handleChangeDestination =
    () => {

      setSelectedDestination(null);
      setShowChallenge(false);
      setSelfies([]);
      setFacebookProof(null);
      setChallengeComplete(false);
      setShowSurvey(false);

      setTimeout(() => {

        document
          .getElementById(
            "destination-selection"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

      }, 100);
    };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {

    onBack();

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }, 50);
  };

  return (
    <main className="tourism-page">

      <TourismHeader
        onBack={handleBack}
        status={
          mode === "online"
            ? "ONLINE"
            : "OFFLINE"
        }
        onOpenAnalytics={
          onOpenAnalytics
        }
      />

      {/* =================================================
          MAIN HERO
      ================================================= */}

      {mode === "online" ? (
        <section className="video-hero">

          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/Dapitan_City_Plaza.jpg"
          >
            <source
              src="/dapitan-tourism.mp4"
              type="video/mp4"
            />
          </video>

          <div className="video-overlay">

            <p className="section-label">
              Dapit na sa 
            </p>

            <h1>
              Dapitan
              <br />
              City
            </h1>

            <p>
              Dapitan Always Inviting!
            </p>

          </div>

        </section>
      ) : (
        <section className="destination-hero offline-main-hero">

          <img
            src="/Dapitan_City_Plaza.jpg"
            alt="Dapitan City Plaza"
          />

          <div className="destination-hero-overlay">

            <p className="section-label">
              OFFLINE EXPERIENCE
            </p>

            <h1>
              Discover
              <br />
              Dapitan
            </h1>

            <p>
              Explore the heritage, landmarks,
              and stories of Dapitan City.
            </p>

          </div>

        </section>
      )}

      {/* =================================================
          VIDEO PRESENTATION
      ================================================= */}

      {mode === "online" && (
        <section className="video-presentation-section">

          <div className="video-presentation-content">

            <p className="section-label">
              DISCOVER DAPITAN
            </p>

            <h2>
              A CITY OF HERITAGE
            </h2>

            <p className="video-presentation-description">
              Explore the rich
              heritage, and Diverse culture of Dapitan City.
              Take a walk down memory lane and uncover the colorful history of our national hero, Dr. Jose Rizal and his works
            </p>

            <div className="video-presentation-player">

              <video
                controls
                playsInline
                preload="metadata"
                poster="/Dapitan_City_Plaza.jpg"
              >
                <source
                  src="/DiscoverDapitan_Video.mp4"
                  type="video/mp4"
                />

                Your browser does not support
                the video tag.

              </video>

            </div>

          </div>

        </section>
      )}

      {/* =================================================
          DESTINATION SELECTION
      ================================================= */}

      <section
        className="content-section"
        id="destination-selection"
      >

        <p className="section-label">
          {mode === "online"
            ? "DISCOVER DAPITAN"
            : "HERITAGE TRAIL"}
        </p>

        <h2>
          Choose Your
          <br />
          Destination
        </h2>

        <p className="large-text">
          Select exactly one destination below.
          Your chosen destination becomes the
          location for your one-selfie challenge.
        </p>

        <DestinationSelector
          selectedDestination={
            selectedDestination
          }
          onSelect={
            handleDestinationSelect
          }
        />

        {/* =================================================
            BEFORE SELECTION
        ================================================= */}

        {!selectedDestination && (
          <div className="challenge-hint">

            <strong>
              STEP 01
            </strong>

            <span>
              Click or tap one destination above
              to begin.
            </span>

          </div>
        )}

        {/* =================================================
            SELECTED DESTINATION
        ================================================= */}

        {selectedDestination &&
          !showChallenge && (
            <div
              className="selected-destination-box"
              ref={
                selectedDestinationRef
              }
            >

              <div className="selected-check">
                ✓
              </div>

              <p className="section-label">
                DESTINATION SELECTED
              </p>

              <h3>
                {
                  selectedDestination.title
                }
              </h3>

              <p>
                Your challenge will be completed
                at this destination. You must
                submit one clear selfie showing
                your face and the selected tourist
                attraction or recognizable
                background.
              </p>

              <div className="selection-meta">

                <span>
                  DESTINATION{" "}
                  {
                    selectedDestination.number
                  }
                </span>

                <span>
                  1 SELFIE REQUIRED
                </span>

              </div>

              <button
                type="button"
                className="primary-button"
                onClick={
                  handleStartChallenge
                }
              >
                CONTINUE TO SELFIE
                CHALLENGE →
              </button>

            </div>
          )}

        {/* =================================================
            CHALLENGE
        ================================================= */}

        {showChallenge &&
          selectedDestination && (
            <div
              ref={challengeRef}
            >

              <ChallengeFlow
                destination={
                  selectedDestination
                }
                selfies={selfies}
                setSelfies={
                  setSelfies
                }
                facebookProof={
                  facebookProof
                }
                setFacebookProof={
                  setFacebookProof
                }
                challengeComplete={
                  challengeComplete
                }
                setChallengeComplete={
                  setChallengeComplete
                }
                onChangeDestination={
                  handleChangeDestination
                }
                canUseFacebook={
                  mode === "online"
                }
              />

            </div>
          )}

        {/* =================================================
            SURVEY CTA
        ================================================= */}

        {challengeComplete &&
          !showSurvey && (
            <SurveyCallout
              title="Challenge Complete"
              description="Your destination challenge has been completed. Continue to the tourism survey."
              label="FINAL STEP"
              onClick={() => {

                setShowSurvey(true);

                setTimeout(() => {

                  document
                    .getElementById(
                      "survey-modal"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });

                }, 150);

              }}
            />
          )}

      </section>

      {/* =================================================
          SURVEY
      ================================================= */}

      {showSurvey && (
        <Survey
          survey={survey}
          surveyLoading={
            surveyLoading
          }
          surveyError={
            surveyError
          }
          mode={mode}
          onClose={() =>
            setShowSurvey(false)
          }
        />
      )}

    </main>
  );
}

/* =========================================================
   ONLINE EXPERIENCE
========================================================= */

function OnlineExperience(props) {
  return (
    <ExperiencePage
      {...props}
      mode="online"
    />
  );
}

/* =========================================================
   OFFLINE EXPERIENCE
========================================================= */

function OfflineExperience(props) {
  return (
    <ExperiencePage
      {...props}
      mode="offline"
    />
  );
}

/* =========================================================
   HEADER
========================================================= */

function TourismHeader({
  onBack,
  status,
  onOpenAnalytics,
}) {
  return (
    <header className="tourism-header">

      <button
        type="button"
        onClick={onBack}
        className="back-button"
        aria-label="Go back"
      >
        ←
      </button>

      <div className="header-brand">
        Discover
        <span>
          Dapitan
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >

        {status === "ONLINE" && (
          <button
            type="button"
            onClick={
              onOpenAnalytics
            }
            title="Analytics"
            aria-label="Open analytics"
            style={{
              border: "0",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: "1",
              padding: "6px",
              color: "#201b16",
            }}
          >
            📊
          </button>
        )}

        <span
          className={
            status === "ONLINE"
              ? "online-badge"
              : "offline-badge"
          }
        >
          {status}
        </span>

      </div>

    </header>
  );
}

/* =========================================================
   ANALYTICS DASHBOARD
========================================================= */

function AnalyticsDashboard({
  onBack,
}) {
  const [visits, setVisits] =
    useState([]);

  const [uniqueVisitors, setUniqueVisitors] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ANALYTICS
  ======================================================= */

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        visitData,
        uniqueData,
      ] = await Promise.all([
        getAnalyticsVisits(),
        getUniqueVisitors(),
      ]);

      console.log(
        "Analytics visits:",
        visitData
      );

      console.log(
        "Unique visitors:",
        uniqueData
      );

      setVisits(
        Array.isArray(visitData)
          ? visitData
          : []
      );

      setUniqueVisitors(
        Number(uniqueData) || 0
      );
    } catch (analyticsError) {
      console.error(
        "Analytics failed:",
        analyticsError
      );

      setError(
        analyticsError?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     NORMALIZE VISIT DATA
  ======================================================= */

  const normalizedVisits =
    visits
      .map((visit) => {

        let date = null;

        if (
          visit?.date instanceof Date
        ) {
          date = visit.date;
        } else if (
          visit?.timestamp?.toDate
        ) {
          date =
            visit.timestamp.toDate();
        } else if (
          visit?.createdAt?.toDate
        ) {
          date =
            visit.createdAt.toDate();
        } else if (
          visit?.timestamp
        ) {
          date = new Date(
            visit.timestamp
          );
        } else if (
          visit?.createdAt
        ) {
          date = new Date(
            visit.createdAt
          );
        } else if (
          visit?.date
        ) {
          date = new Date(
            visit.date
          );
        }

        return {
          ...visit,
          parsedDate:
            date &&
            !Number.isNaN(
              date.getTime()
            )
              ? date
              : null,
        };
      })
      .filter(
        (visit) =>
          visit.parsedDate
      )
      .sort(
        (a, b) =>
          a.parsedDate -
          b.parsedDate
      );

  /* =======================================================
     GROUP VISITS BY DATE
  ======================================================= */

  const visitsByDate = {};

  normalizedVisits.forEach(
    (visit) => {

      const key =
        visit.parsedDate
          .toISOString()
          .slice(0, 10);

      visitsByDate[key] =
        (visitsByDate[key] || 0) + 1;
    }
  );

  const graphData =
    Object.entries(
      visitsByDate
    ).slice(-14);

  const graphMax =
    Math.max(
      1,
      ...graphData.map(
        ([, value]) =>
          value
      )
    );

  /* =======================================================
     SUBMISSION COUNT

     Your response documents are the submitted
     survey responses. We count successful analytics
     records only from the data returned by the
     analytics module when it exposes a submission
     count.

     Otherwise, use survey submissions if the
     analytics.js result contains them.
  ======================================================= */

  const submissionCount =
    visits.reduce(
      (count, visit) => {

        if (
          visit?.type ===
            "survey" ||
          visit?.event ===
            "survey_submission" ||
          visit?.eventType ===
            "survey_submission"
        ) {
          return count + 1;
        }

        return count;
      },
      0
    );

  return (
    <main className="app">

      <section
        className="mechanics-screen"
        style={{
          maxWidth: "1000px",
          width: "100%",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            width: "100%",
          }}
        >

          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
            style={{
              width: "auto",
              minWidth: "120px",
              padding:
                "0 18px",
              marginBottom:
                "30px",
            }}
          >
            ← BACK
          </button>

          <p className="section-label">
            ANALYTICS
          </p>

          <h1>
            Tourism
            <br />
            Dashboard
          </h1>

          <p className="intro-text">
            Overview of visitors,
            app usage, and survey
            activity.
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="mode-preview"
            style={{
              width: "100%",
            }}
          >
            <strong>
              LOADING ANALYTICS...
            </strong>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="warning-message"
            style={{
              width: "100%",
            }}
          >

            <strong>
              ⚠ Analytics unavailable
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                loadAnalytics
              }
              style={{
                marginTop: "15px",
              }}
            >
              TRY AGAIN
            </button>

          </div>
        )}

        {!loading &&
          !error && (
            <>
              {/* =========================================
                  STAT CARDS
              ========================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  width: "100%",
                  margin:
                    "20px 0 30px",
                }}
              >

                {/* CARD 1 */}

                <div
                  style={{
                    padding: "24px",
                    background:
                      "#201b16",
                    color: "#fff",
                    minHeight:
                      "150px",
                  }}
                >

                  <p
                    className="section-label"
                    style={{
                      marginBottom:
                        "12px",
                    }}
                  >
                    SURVEY
                  </p>

                  <strong
                    style={{
                      display:
                        "block",
                      fontFamily:
                        "Georgia, serif",
                      fontSize:
                        "48px",
                      fontWeight:
                        "500",
                    }}
                  >
                    {submissionCount}
                  </strong>

                  <p
                    style={{
                      color:
                        "#aaa39a",
                      margin:
                        "8px 0 0",
                    }}
                  >
                    People submitted
                  </p>

                </div>

                {/* CARD 2 */}

                <div
                  style={{
                    padding: "24px",
                    background:
                      "#201b16",
                    color: "#fff",
                    minHeight:
                      "150px",
                  }}
                >

                  <p
                    className="section-label"
                    style={{
                      marginBottom:
                        "12px",
                    }}
                  >
                    APP USAGE
                  </p>

                  <strong
                    style={{
                      display:
                        "block",
                      fontFamily:
                        "Georgia, serif",
                      fontSize:
                        "48px",
                      fontWeight:
                        "500",
                    }}
                  >
                    {visits.length}
                  </strong>

                  <p
                    style={{
                      color:
                        "#aaa39a",
                      margin:
                        "8px 0 0",
                    }}
                  >
                    Scans / URL visits
                  </p>

                </div>

                {/* CARD 3 */}

                <div
                  style={{
                    padding: "24px",
                    background:
                      "#b8975a",
                    color:
                      "#17130f",
                    minHeight:
                      "150px",
                  }}
                >

                  <p
                    style={{
                      margin:
                        "0 0 12px",
                      fontSize:
                        "10px",
                      fontWeight:
                        "800",
                      letterSpacing:
                        "3px",
                    }}
                  >
                    UNIQUE
                  </p>

                  <strong
                    style={{
                      display:
                        "block",
                      fontFamily:
                        "Georgia, serif",
                      fontSize:
                        "48px",
                      fontWeight:
                        "500",
                    }}
                  >
                    {
                      uniqueVisitors
                    }
                  </strong>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      opacity:
                        "0.7",
                    }}
                  >
                    Unique visitors
                  </p>

                </div>

              </div>

              {/* =========================================
                  VISIT GRAPH
              ========================================= */}

              <div
                style={{
                  width: "100%",
                  padding: "24px",
                  background:
                    "#fff",
                  border:
                    "1px solid #d3cabc",
                }}
              >

                <p className="section-label">
                  VISITS
                </p>

                <h2
                  style={{
                    margin:
                      "0 0 8px",
                    fontFamily:
                      "Georgia, serif",
                    fontSize:
                      "32px",
                    fontWeight:
                      "500",
                  }}
                >
                  People Visiting
                  the App
                </h2>

                <p
                  style={{
                    color:
                      "#71695f",
                    fontSize:
                      "13px",
                    margin:
                      "0 0 30px",
                  }}
                >
                  Daily app visits from
                  the latest recorded
                  activity.
                </p>

                {graphData.length ===
                0 ? (
                  <div
                    style={{
                      minHeight:
                        "250px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      border:
                        "1px dashed #d3cabc",
                      color:
                        "#81796e",
                      textAlign:
                        "center",
                      padding:
                        "20px",
                    }}
                  >
                    No visit data
                    available yet.
                  </div>
                ) : (
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "flex-end",
                      gap: "10px",
                      height:
                        "260px",
                      width:
                        "100%",
                      overflowX:
                        "auto",
                      padding:
                        "20px 5px 0",
                      borderBottom:
                        "1px solid #d3cabc",
                    }}
                  >

                    {graphData.map(
                      (
                        [
                          date,
                          value,
                        ]
                      ) => {

                        const height =
                          Math.max(
                            8,
                            (
                              value /
                              graphMax
                            ) *
                              200
                          );

                        const label =
                          new Date(
                            `${date}T00:00:00`
                          ).toLocaleDateString(
                            undefined,
                            {
                              month:
                                "short",
                              day:
                                "numeric",
                            }
                          );

                        return (
                          <div
                            key={date}
                            style={{
                              minWidth:
                                "44px",
                              height:
                                "220px",
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              alignItems:
                                "center",
                              justifyContent:
                                "flex-end",
                              gap:
                                "7px",
                            }}
                          >

                            <span
                              style={{
                                fontSize:
                                  "10px",
                                fontWeight:
                                  "800",
                                color:
                                  "#8d6d37",
                              }}
                            >
                              {value}
                            </span>

                            <div
                              style={{
                                width:
                                  "24px",
                                height:
                                  `${height}px`,
                                background:
                                  "#b8975a",
                                minHeight:
                                  "8px",
                              }}
                              title={`${value} visit${
                                value === 1
                                  ? ""
                                  : "s"
                              }`}
                            />

                            <span
                              style={{
                                fontSize:
                                  "8px",
                                color:
                                  "#81796e",
                                whiteSpace:
                                  "nowrap",
                                transform:
                                  "rotate(-45deg)",
                                transformOrigin:
                                  "center",
                                marginTop:
                                  "8px",
                              }}
                            >
                              {label}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

              {/* =========================================
                  SUMMARY
              ========================================= */}

              <div
                className="mode-preview"
                style={{
                  width: "100%",
                  marginTop:
                    "20px",
                }}
              >

                <span className="status-dot online" />

                <div>

                  <strong>
                    LIVE ANALYTICS
                  </strong>

                  <p>
                    Analytics data is
                    loaded directly from
                    your Firebase
                    analytics records.
                  </p>

                </div>

              </div>

            </>
          )}

      </section>

    </main>
  );
}

/* =========================================================
   DESTINATION SELECTOR
========================================================= */

function DestinationSelector({
  selectedDestination,
  onSelect,
}) {
  return (
    <div className="destination-selector">

      {DESTINATIONS.map(
        (destination) => {

          const selected =
            selectedDestination?.id ===
            destination.id;

          return (
            <button
              key={
                destination.id
              }
              type="button"
              className={[
                "destination-card",
                "destination-card-selectable",
                selected
                  ? "selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                onSelect(
                  destination
                )
              }
              aria-pressed={
                selected
              }
            >

              <div className="destination-image">

                <img
                  src={
                    destination.image
                  }
                  alt={
                    destination.title
                  }
                  loading="lazy"
                  onError={(
                    event
                  ) => {

                    console.error(
                      "Image failed to load:",
                      destination.image
                    );

                    event
                      .currentTarget
                      .parentElement
                      .classList.add(
                        "image-error"
                      );
                  }}
                />

                <span className="destination-number">
                  {
                    destination.number
                  }
                </span>

                {selected && (
                  <span className="destination-selected">
                    ✓ SELECTED
                  </span>
                )}

              </div>

              <div className="destination-content">

                <p className="card-number">
                  DESTINATION{" "}
                  {
                    destination.number
                  }
                </p>

                <h3>
                  {
                    destination.title
                  }
                </h3>

                <p>
                  {
                    destination.description
                  }
                </p>

                <span className="choose-destination">

                  {selected
                    ? "DESTINATION SELECTED ✓"
                    : "CHOOSE THIS DESTINATION →"}

                </span>

              </div>

            </button>
          );
        }
      )}

    </div>
  );
}

/* =========================================================
   CHALLENGE FLOW
========================================================= */

function ChallengeFlow({
  destination,
  selfies,
  setSelfies,
  facebookProof,
  setFacebookProof,
  challengeComplete,
  setChallengeComplete,
  onChangeDestination,
  canUseFacebook,
}) {
  const [activeStep, setActiveStep] =
    useState(1);

  /* =======================================================
     ONLY 1 SELFIE IS REQUIRED
  ======================================================= */

  const selfieComplete =
    selfies.length === 1;

  const facebookComplete =
    Boolean(facebookProof);

  /* =======================================================
     SELFIE UPLOAD
  ======================================================= */

  const handleSelfieUpload =
    (event) => {

      const files =
        Array.from(
          event.target.files ||
            []
        );

      if (!files.length) {
        return;
      }

      const imageFiles =
        files.filter(
          (file) =>
            file.type &&
            file.type.startsWith(
              "image/"
            )
        );

      if (!imageFiles.length) {

        alert(
          "Please select an image file only."
        );

        event.target.value =
          "";

        return;
      }

      const nextSelfie =
        imageFiles[0];

      setSelfies([
        nextSelfie,
      ]);

      event.target.value =
        "";

      setActiveStep(2);

      setTimeout(() => {

        document
          .getElementById(
            "facebook-proof"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "start",
          });

      }, 180);
    };

  /* =======================================================
     REMOVE SELFIE
  ======================================================= */

  const removeSelfie =
    (index) => {

      setSelfies(
        (previous) =>
          previous.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex !==
              index
          )
      );

      setActiveStep(1);
      setChallengeComplete(
        false
      );
    };

  /* =======================================================
     FACEBOOK SCREENSHOT
  ======================================================= */

  const handleFacebookProofUpload =
    (event) => {

      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (
        !file.type ||
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please upload a screenshot image."
        );

        event.target.value =
          "";

        return;
      }

      setFacebookProof(
        file
      );

      event.target.value =
        "";

      setActiveStep(3);

      setTimeout(() => {

        document
          .getElementById(
            "facebook-final-check"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "center",
          });

      }, 180);
    };

  /* =======================================================
     FINISH CHALLENGE
  ======================================================= */

  const finishChallenge =
    () => {

      if (!selfieComplete) {

        alert(
          "Please upload 1 selfie proof."
        );

        setActiveStep(1);

        setTimeout(() => {

          document
            .getElementById(
              "challenge"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start",
            });

        }, 100);

        return;
      }

      if (!facebookComplete) {

        alert(
          `Please upload a screenshot showing your Facebook proof and ${REQUIRED_HASHTAG}.`
        );

        setActiveStep(2);

        setTimeout(() => {

          document
            .getElementById(
              "facebook-proof"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start",
            });

        }, 100);

        return;
      }

      setChallengeComplete(
        true
      );

      setTimeout(() => {

        document
          .getElementById(
            "challenge-complete"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "center",
          });

      }, 180);
    };

  /* =======================================================
     STEP NAVIGATION
  ======================================================= */

  const openStep =
    (step) => {

      if (step === 1) {

        setActiveStep(1);

        setTimeout(() => {

          document
            .getElementById(
              "challenge-selfies"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start",
            });

        }, 100);

        return;
      }

      if (
        step === 2 &&
        selfieComplete
      ) {

        setActiveStep(2);

        setTimeout(() => {

          document
            .getElementById(
              "facebook-proof"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "start",
            });

        }, 100);

        return;
      }

      if (
        step === 3 &&
        selfieComplete &&
        facebookComplete
      ) {

        setActiveStep(3);

        setTimeout(() => {

          document
            .getElementById(
              "facebook-final-check"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block:
                "center",
            });

        }, 100);
      }
    };

  return (
    <section
      className="challenge-flow"
      id="challenge"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="challenge-header">

        <p className="section-label">
          YOUR CHALLENGE
        </p>

        <h2>
          {destination.title}
        </h2>

        <p>
          Complete every requirement
          below before proceeding to
          the survey.
        </p>

        <button
          type="button"
          className="change-destination-button"
          onClick={
            onChangeDestination
          }
        >
          ← CHANGE DESTINATION
        </button>

      </div>

      {/* =================================================
          STEP INDICATOR
      ================================================= */}

      <div className="challenge-steps">

        <ChallengeStep
          number="01"
          title="Selfie"
          active={
            activeStep === 1
          }
          complete={
            selfieComplete
          }
          onClick={() =>
            openStep(1)
          }
        />

        <ChallengeStep
          number="02"
          title="Facebook"
          active={
            activeStep === 2
          }
          complete={
            facebookComplete
          }
          onClick={() =>
            openStep(2)
          }
          locked={
            !selfieComplete
          }
        />

        <ChallengeStep
          number="03"
          title="Submit"
          active={
            activeStep === 3
          }
          complete={
            challengeComplete
          }
          onClick={() =>
            openStep(3)
          }
          locked={
            !selfieComplete ||
            !facebookComplete
          }
        />

      </div>

      {/* =================================================
          STEP 1
      ================================================= */}

      <div
        className="challenge-panel"
        id="challenge-selfies"
      >

        <div className="challenge-panel-number">
          STEP 01
        </div>

        <h3>
          Take 1 Selfie
        </h3>

        <p className="challenge-panel-intro">
          Upload one clear selfie taken
          at your selected destination.
        </p>

        <div className="required-notice">

          <strong>
            📸 REQUIRED: 1 SELFIE
          </strong>

          <span>
            Your photo must be taken
            within:
          </span>

          <b>
            {destination.title}
          </b>

        </div>

        <div className="rules-box">

          <div className="rules-title">
            SELFIE ACCEPTANCE RULES
          </div>

          <div className="rule accepted">

            <span>
              ✓
            </span>

            <div>

              <strong>
                ACCEPTED
              </strong>

              <p>
                Your face must be
                clearly visible.
              </p>

              <p>
                The selected tourist
                attraction or recognizable
                background must also be
                clearly visible.
              </p>

            </div>

          </div>

          <div className="rule rejected">

            <span>
              ×
            </span>

            <div>

              <strong>
                STRICTLY NOT ACCEPTED
              </strong>

              <p>
                Edited, manipulated,
                filtered, or altered
                selfies.
              </p>

              <p>
                Duplicate or identical
                selfies.
              </p>

              <p>
                Unclear or blurry
                selfies.
              </p>

              <p>
                Photos where the
                participant's face cannot
                clearly be seen.
              </p>

              <p>
                Photos that do not clearly
                show the selected destination
                or recognizable background.
              </p>

            </div>

          </div>

        </div>

        {!selfieComplete && (
          <label
            className="upload-zone"
            htmlFor="selfie-upload"
          >

            <span className="upload-icon">
              +
            </span>

            <strong>
              ADD SELFIE PROOF
            </strong>

            <small>
              Select 1 image file
            </small>

            <input
              id="selfie-upload"
              type="file"
              accept="image/*"
              onChange={
                handleSelfieUpload
              }
            />

          </label>
        )}

        {selfies.length > 0 && (
          <div className="selfie-preview-grid">

            {selfies.map(
              (
                file,
                index
              ) => (
                <SelfiePreview
                  key={`${file.name}-${file.lastModified}-${index}`}
                  file={file}
                  index={
                    index
                  }
                  onRemove={() =>
                    removeSelfie(
                      index
                    )
                  }
                />
              )
            )}

          </div>
        )}

        <div
          className={
            selfieComplete
              ? "upload-status complete"
              : "upload-status"
          }
        >

          <span>
            {selfieComplete
              ? "✓"
              : selfies.length}
          </span>

          <strong>
            {selfieComplete
              ? "1 OF 1 SELFIE UPLOADED"
              : "0 OF 1 SELFIE UPLOADED"}
          </strong>

        </div>

        {selfieComplete && (
          <button
            type="button"
            className="primary-button"
            onClick={() => {

              setActiveStep(
                2
              );

              setTimeout(() => {

                document
                  .getElementById(
                    "facebook-proof"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                    block:
                      "start",
                  });

              }, 150);

            }}
          >
            CONTINUE TO FACEBOOK
            PROOF →
          </button>
        )}

      </div>

      {/* =================================================
          STEP 2
      ================================================= */}

      {activeStep >= 2 && (
        <div
          className="challenge-panel facebook-proof-panel"
          id="facebook-proof"
        >

          <div className="challenge-panel-number">
            STEP 02
          </div>

          <h3>
            Facebook Proof
          </h3>

          <p className="challenge-panel-intro">
            Publish your challenge proof
            according to the Facebook
            instructions, then upload a
            screenshot showing your proof
            and required hashtag.
          </p>

          <div className="facebook-action-card">

            <div className="facebook-icon">
              f
            </div>

            <div className="facebook-action-content">

              <strong>
                OPEN FACEBOOK CHALLENGE
              </strong>

              <p>
                Visit the Facebook page or
                challenge post for the
                required posting instructions.
              </p>

              <a
                href={
                  FACEBOOK_PAGE_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="facebook-link"
              >
                OPEN FACEBOOK PAGE ↗
              </a>

            </div>

          </div>

          <div className="hashtag-box">

            <span>
              REQUIRED HASHTAG
            </span>

            <strong>
              {REQUIRED_HASHTAG}
            </strong>

            <p>
              This hashtag must be clearly
              visible in the screenshot you
              submit.
            </p>

          </div>

          <div className="proof-checklist">

            <div>
              <span>
                01
              </span>

              <p>
                Open the Facebook challenge
                page.
              </p>
            </div>

            <div>
              <span>
                02
              </span>

              <p>
                Follow the required Facebook
                posting instructions.
              </p>
            </div>

            <div>
              <span>
                03
              </span>

              <p>
                Make sure {REQUIRED_HASHTAG}
                is visible in your Facebook
                proof.
              </p>
            </div>

            <div>
              <span>
                04
              </span>

              <p>
                Take a clear screenshot
                showing the Facebook proof
                and required hashtag.
              </p>
            </div>

            <div>
              <span>
                05
              </span>

              <p>
                Upload that screenshot below.
              </p>
            </div>

          </div>

          {!canUseFacebook && (
            <div className="offline-proof-warning">

              <strong>
                ⚠ FACEBOOK REQUIRES INTERNET
              </strong>

              <p>
                You are currently using offline
                mode. Your selfie information can
                be prepared, but Facebook posting
                and proof verification require an
                internet connection.
              </p>

            </div>
          )}

          <label
            className="upload-zone facebook-upload"
            htmlFor="facebook-proof-upload"
          >

            <span className="upload-icon">
              ↑
            </span>

            <strong>
              UPLOAD FACEBOOK SCREENSHOT
            </strong>

            <small>
              Screenshot must clearly show{" "}
              {REQUIRED_HASHTAG}
            </small>

            <input
              id="facebook-proof-upload"
              type="file"
              accept="image/*"
              onChange={
                handleFacebookProofUpload
              }
            />

          </label>

          {facebookProof && (
            <ProofPreview
              file={
                facebookProof
              }
              onRemove={() => {

                setFacebookProof(
                  null
                );

                setChallengeComplete(
                  false
                );

                setActiveStep(
                  2
                );

              }}
            />
          )}

          {facebookComplete && (
            <div className="proof-success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  FACEBOOK PROOF UPLOADED
                </strong>

                <p>
                  Make sure the screenshot
                  clearly shows{" "}
                  {REQUIRED_HASHTAG}.
                </p>

              </div>

            </div>
          )}

          <div
            className="final-proof-check"
            id="facebook-final-check"
          >

            <p className="section-label">
              FINAL VERIFICATION
            </p>

            <h4>
              Before you submit
            </h4>

            <label>

              <input
                type="checkbox"
                checked={
                  selfieComplete
                }
                readOnly
              />

              <span>
                I uploaded exactly 1
                selfie proof.
              </span>

            </label>

            <label>

              <input
                type="checkbox"
                checked={
                  facebookComplete
                }
                readOnly
              />

              <span>
                I uploaded a Facebook
                screenshot showing the
                required hashtag.
              </span>

            </label>

            <label>

              <input
                type="checkbox"
                checked={
                  selfieComplete &&
                  facebookComplete
                }
                readOnly
              />

              <span>
                I understand that unclear,
                duplicated, edited, or
                invalid proof may be rejected
                during verification.
              </span>

            </label>

          </div>

          <button
            type="button"
            className="primary-button"
            disabled={
              !selfieComplete ||
              !facebookComplete
            }
            onClick={
              finishChallenge
            }
          >
            SUBMIT CHALLENGE PROOF →
          </button>

          {!selfieComplete && (
            <p className="locked-message">
              🔒 Upload your 1 selfie first.
            </p>
          )}

          {selfieComplete &&
            !facebookComplete && (
              <p className="locked-message">
                🔒 Upload your Facebook proof
                screenshot first.
              </p>
            )}

        </div>
      )}

      {/* =================================================
          COMPLETED
      ================================================= */}

      {challengeComplete && (
        <div
          className="challenge-complete"
          id="challenge-complete"
        >

          <div className="complete-icon">
            ✓
          </div>

          <p className="section-label">
            CHALLENGE COMPLETED
          </p>

          <h3>
            You're Ready for the Survey
          </h3>

          <p>
            Your selfie proof and Facebook
            screenshot have been uploaded
            for this session. Submitted
            materials may still be reviewed
            for compliance.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => {

              document
                .getElementById(
                  "survey-callout"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                  block:
                    "center",
                });

            }}
          >
            CONTINUE TO SURVEY →
          </button>

        </div>
      )}

    </section>
  );
}

/* =========================================================
   CHALLENGE STEP
========================================================= */

function ChallengeStep({
  number,
  title,
  active,
  complete,
  locked,
  onClick,
}) {
  return (
    <button
      type="button"
      className={[
        "challenge-step",
        active
          ? "active"
          : "",
        complete
          ? "complete"
          : "",
        locked
          ? "locked"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={
        onClick
      }
      disabled={
        locked
      }
    >

      <span className="challenge-step-number">

        {complete
          ? "✓"
          : locked
          ? "🔒"
          : number}

      </span>

      <span>
        {title}
      </span>

    </button>
  );
}

/* =========================================================
   SELFIE PREVIEW
========================================================= */

function SelfiePreview({
  file,
  index,
  onRemove,
}) {
  const [preview, setPreview] =
    useState("");

  useEffect(() => {

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setPreview(url);

    return () => {

      URL.revokeObjectURL(
        url
      );

    };

  }, [file]);

  return (
    <div className="selfie-preview">

      {preview && (
        <img
          src={preview}
          alt={`Selfie proof ${
            index + 1
          }`}
        />
      )}

      <span className="selfie-label">
        SELFIE {index + 1}
      </span>

      <button
        type="button"
        onClick={
          onRemove
        }
        aria-label={`Remove selfie ${
          index + 1
        }`}
      >
        ×
      </button>

    </div>
  );
}

/* =========================================================
   FACEBOOK PROOF PREVIEW
========================================================= */

function ProofPreview({
  file,
  onRemove,
}) {
  const [preview, setPreview] =
    useState("");

  useEffect(() => {

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setPreview(url);

    return () => {

      URL.revokeObjectURL(
        url
      );

    };

  }, [file]);

  return (
    <div className="facebook-proof-preview">

      <div className="proof-image-wrapper">

        {preview && (
          <img
            src={preview}
            alt="Facebook proof screenshot"
          />
        )}

      </div>

      <div className="proof-preview-info">

        <span className="proof-file-icon">
          ✓
        </span>

        <div>

          <strong>
            Screenshot ready
          </strong>

          <p>
            {file.name}
          </p>

        </div>

        <button
          type="button"
          onClick={
            onRemove
          }
        >
          REMOVE
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   SURVEY CALLOUT
========================================================= */

function SurveyCallout({
  title,
  description,
  label,
  onClick,
}) {
  return (
    <div
      className="survey-callout"
      id="survey-callout"
    >

      <p className="section-label">
        {label}
      </p>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={
          onClick
        }
      >
        TAKE SURVEY →
      </button>

    </div>
  );
}

/* =========================================================
   SURVEY
========================================================= */

function Survey({
  survey,
  surveyLoading,
  surveyError,
  mode,
  onClose,
}) {
  const [answers, setAnswers] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOADING
  ======================================================= */

  if (surveyLoading) {
    return (
      <div
        className="modal"
        id="survey-modal"
      >

        <div className="survey-modal">

          <button
            type="button"
            className="close-button"
            onClick={
              onClose
            }
          >
            ×
          </button>

          <p className="section-label">
            SURVEY
          </p>

          <h2>
            Loading survey...
          </h2>

          <p>
            Please wait while we prepare
            the questions.
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    surveyError ||
    !survey
  ) {
    return (
      <div
        className="modal"
        id="survey-modal"
      >

        <div className="survey-modal">

          <button
            type="button"
            className="close-button"
            onClick={
              onClose
            }
          >
            ×
          </button>

          <p className="section-label">
            SURVEY
          </p>

          <h2>
            Survey unavailable
          </h2>

          <p>
            We couldn't load the survey
            right now.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={
              onClose
            }
          >
            CLOSE
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     QUESTIONS
  ======================================================= */

  const questions =
    Array.isArray(
      survey.questions
    )
      ? [
          ...survey.questions,
        ].sort(
          (a, b) =>
            Number(
              a.order || 0
            ) -
            Number(
              b.order || 0
            )
        )
      : [];

  /* =======================================================
     ANSWER HANDLER
  ======================================================= */

  const handleAnswer = (
    questionId,
    value
  ) => {

    setAnswers(
      (
        previousAnswers
      ) => ({
        ...previousAnswers,
        [questionId]:
          value,
      })
    );
  };

  /* =======================================================
     REQUIRED
  ======================================================= */

  const allRequiredAnswered =
    questions
      .filter(
        (question) =>
          question.required ===
            true ||
          question.required ===
            "true"
      )
      .every(
        (question) =>
          answers[
            question.id
          ] !==
            undefined &&
          answers[
            question.id
          ] !==
            null &&
          answers[
            question.id
          ] !== ""
      );

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async () => {

      if (
        !allRequiredAnswered ||
        submitting
      ) {
        return;
      }

      setSubmitting(
        true
      );

      setError("");

      try {

        console.log(
          "Submitting ALL answers:",
          answers
        );

        await submitSurvey({
          surveyId:
            survey.id,
          answers,
          mode,
        });

        setSubmitted(
          true
        );

      } catch (
        submitError
      ) {

        console.error(
          "Survey submission failed:",
          submitError
        );

        setError(
          "We couldn't save your response right now. Please try again."
        );

      } finally {

        setSubmitting(
          false
        );

      }
    };

  /* =======================================================
     SUCCESS
  ======================================================= */

  if (submitted) {
    return (
      <div
        className="modal"
        id="survey-modal"
      >

        <div className="survey-modal survey-success">

          <div className="success-icon">
            ✓
          </div>

          <p className="section-label">
            SURVEY COMPLETE
          </p>

          <h2>
            Thank You!
          </h2>

          <p>
            Your response has been recorded.
            Thank you for participating in
            the Discover Dapitan City
            experience.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={
              onClose
            }
          >
            CLOSE
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     SURVEY MODAL
  ======================================================= */

  return (
    <div
      className="modal"
      id="survey-modal"
    >

      <div className="survey-modal">

        <button
          type="button"
          className="close-button"
          onClick={
            onClose
          }
          aria-label="Close survey"
        >
          ×
        </button>

        <div className="survey-scroll">

          <p className="section-label">
            {survey.title ||
              "SURVEY"}
          </p>

          <h2>
            Share Your Experience
          </h2>

          <p>
            Answer all required questions
            before submitting your response.
          </p>

          <div className="survey-progress">
            {questions.length} QUESTIONS
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="survey-questions">

            {questions.map(
              (
                question,
                index
              ) => {

                const type =
                  String(
                    question.type ||
                      "choice"
                  )
                    .toLowerCase()
                    .replace(
                      /[_-]/g,
                      ""
                    );

                const required =
                  question.required ===
                    true ||
                  question.required ===
                    "true";

                return (
                  <div
                    className="survey-question"
                    key={
                      question.id ||
                      index
                    }
                  >

                    <div className="question-number">
                      QUESTION{" "}
                      {index + 1}
                    </div>

                    <h3>
                      {
                        question.question
                      }
                    </h3>

                    {required && (
                      <span className="required-label">
                        REQUIRED
                      </span>
                    )}

                    {/* =======================================
                        RATING 1–5
                    ======================================= */}

                    {type ===
                      "rating" && (
                      <div className="rating-options">

                        {[
                          1,
                          2,
                          3,
                          4,
                          5,
                        ].map(
                          (
                            rating
                          ) => (

                            <button
                              key={
                                rating
                              }
                              type="button"
                              className={
                                answers[
                                  question
                                    .id
                                ] ===
                                rating
                                  ? "rating-button selected"
                                  : "rating-button"
                              }
                              onClick={() =>
                                handleAnswer(
                                  question.id,
                                  rating
                                )
                              }
                            >

                              <span>
                                {
                                  rating
                                }
                              </span>

                              <small>
                                {rating ===
                                1
                                  ? "Poor"
                                  : rating ===
                                    2
                                  ? "Fair"
                                  : rating ===
                                    3
                                  ? "Average"
                                  : rating ===
                                    4
                                  ? "Good"
                                  : "Excellent"}
                              </small>

                            </button>

                          )
                        )}

                      </div>
                    )}

                    {/* =======================================
                        YES / NO
                    ======================================= */}

                    {(
                      type ===
                        "yesno" ||
                      type ===
                        "boolean"
                    ) && (
                      <div className="poll-options">

                        {[
                          "Yes",
                          "No",
                        ].map(
                          (
                            option
                          ) => (

                            <button
                              key={
                                option
                              }
                              type="button"
                              className={
                                answers[
                                  question
                                    .id
                                ] ===
                                option
                                  ? "poll-option selected"
                                  : "poll-option"
                              }
                              onClick={() =>
                                handleAnswer(
                                  question.id,
                                  option
                                )
                              }
                            >

                              <span>
                                {answers[
                                  question
                                    .id
                                ] ===
                                option
                                  ? "●"
                                  : "○"}
                              </span>

                              {
                                option
                              }

                            </button>

                          )
                        )}

                      </div>
                    )}

                    {/* =======================================
                        CHOICE
                    ======================================= */}

                    {(
                      type ===
                        "choice" ||
                      type ===
                        "multiplechoice" ||
                      type ===
                        "select"
                    ) && (
                      <div className="poll-options">

                        {(
                          question.options ||
                          []
                        ).map(
                          (
                            option
                          ) => (

                            <button
                              key={
                                option
                              }
                              type="button"
                              className={
                                answers[
                                  question
                                    .id
                                ] ===
                                option
                                  ? "poll-option selected"
                                  : "poll-option"
                              }
                              onClick={() =>
                                handleAnswer(
                                  question.id,
                                  option
                                )
                              }
                            >

                              <span>
                                {answers[
                                  question
                                    .id
                                ] ===
                                option
                                  ? "●"
                                  : "○"}
                              </span>

                              {
                                option
                              }

                            </button>

                          )
                        )}

                      </div>
                    )}

                    {/* =======================================
                        TEXT
                    ======================================= */}

                    {(
                      type ===
                        "text" ||
                      type ===
                        "textarea" ||
                      type ===
                        "shorttext"
                    ) && (
                      <textarea
                        className="survey-textarea"
                        value={
                          answers[
                            question
                              .id
                          ] || ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleAnswer(
                            question.id,
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Type your answer..."
                        rows="4"
                      />
                    )}

                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              ANSWER STATUS
          ================================================= */}

          <div className="survey-answer-status">

            {
              Object.keys(
                answers
              ).length
            }{" "}
            of{" "}
            {
              questions.length
            }{" "}
            answered

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="survey-error">
              {error}
            </div>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="button"
            className="primary-button submit-survey-button"
            disabled={
              !allRequiredAnswered ||
              submitting ||
              questions.length ===
                0
            }
            onClick={
              handleSubmit
            }
          >
            {submitting
              ? "SUBMITTING..."
              : "SUBMIT ALL RESPONSES →"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;