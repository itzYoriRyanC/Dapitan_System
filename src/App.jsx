import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("warning");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const continueToExperience = () => {
    setScreen("mechanics");
  };

  const startExperience = () => {
    setScreen(isOnline ? "online" : "offline");
  };

  if (screen === "warning") {
    return (
      <main className="app">
        <section className="warning-screen">
          <div className="brand">
            DAPITAN
            <span>CITY TOURISM</span>
          </div>

          <div className="warning-icon">!</div>

          <p className="section-label">BEFORE YOU PROCEED</p>

          <h1>Are You Ready<br />for the Challenge?</h1>

          <p className="intro-text">
            Welcome to the Dapitan City Tourism experience.
            Before proceeding, please read the challenge mechanics.
          </p>

          <div className="warning-message">
            <strong>⚠ Important Notice</strong>
            <p>
              This experience contains interactive activities and
              survey questions. Your participation helps us understand
              your tourism experience.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={continueToExperience}
          >
            YES, PROCEED
          </button>

          <button
            className="secondary-button"
            onClick={() => setScreen("exit")}
          >
            NO, EXIT
          </button>

          <div className="live-status">
            <span className={isOnline ? "status-dot online" : "status-dot"} />
            {isOnline ? "Online experience available" : "Offline mode available"}
          </div>
        </section>
      </main>
    );
  }

  if (screen === "exit") {
    return (
      <main className="app">
        <section className="simple-screen">
          <div className="exit-icon">✓</div>

          <h1>Thank You</h1>

          <p>
            You have chosen not to continue with the tourism
            challenge.
          </p>

          <button
            className="primary-button"
            onClick={() => setScreen("warning")}
          >
            GO BACK
          </button>
        </section>
      </main>
    );
  }

  if (screen === "mechanics") {
    return (
      <main className="app">
        <section className="mechanics-screen">
          <p className="section-label">CHALLENGE MECHANICS</p>

          <h1>Discover<br />Dapitan</h1>

          <p className="intro-text">
            Explore the story, places, and culture of Dapitan City.
            At the end, share your experience through our survey.
          </p>

          <div className="mechanic-list">
            <div className="mechanic">
              <span>01</span>
              <div>
                <strong>Explore</strong>
                <p>Discover Dapitan City tourism content.</p>
              </div>
            </div>

            <div className="mechanic">
              <span>02</span>
              <div>
                <strong>Learn</strong>
                <p>Read the stories behind the destinations.</p>
              </div>
            </div>

            <div className="mechanic">
              <span>03</span>
              <div>
                <strong>Participate</strong>
                <p>Complete the tourism survey at the end.</p>
              </div>
            </div>

            <div className="mechanic">
              <span>04</span>
              <div>
                <strong>Share</strong>
                <p>Your answers help improve the experience.</p>
              </div>
            </div>
          </div>

          <div className="mode-preview">
            <span className={isOnline ? "status-dot online" : "status-dot"} />

            <div>
              <strong>
                {isOnline ? "ONLINE MODE" : "OFFLINE MODE"}
              </strong>

              <p>
                {isOnline
                  ? "Video and interactive content enabled."
                  : "Essential tourism content available offline."}
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={startExperience}
          >
            START EXPERIENCE →
          </button>
        </section>
      </main>
    );
  }

  if (screen === "offline") {
    return <OfflineExperience onBack={() => setScreen("warning")} />;
  }

  return <OnlineExperience onBack={() => setScreen("warning")} />;
}


function OfflineExperience({ onBack }) {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <main className="tourism-page">
      <header className="tourism-header">
        <button onClick={onBack} className="back-button">
          ←
        </button>

        <div className="header-brand">
          DAPITAN
          <span>CITY TOURISM</span>
        </div>

        <span className="offline-badge">OFFLINE</span>
      </header>

      <section className="offline-hero">
        <p className="section-label">DAPITAN CITY</p>

        <h1>A City of<br />Heritage</h1>

        <p>
          Discover the history, culture, and destinations
          of Dapitan City even without an internet connection.
        </p>
      </section>

      <section className="content-section">
        <p className="section-label">EXPLORE</p>

        <h2>Places to Discover</h2>

        <TourismCard
          title="Rizal Shrine"
          description="Explore the historic place where Dr. Jose Rizal spent his exile."
          image="/images/rizal-shrine.jpg"
        />

        <TourismCard
          title="Dapitan Heritage"
          description="Discover the stories and cultural heritage that shaped the city."
          image="/images/dapitan-heritage.jpg"
        />

        <TourismCard
          title="Dapitan City"
          description="Experience the character and beauty of the city."
          image="/images/dapitan-city.jpg"
        />

        <div className="survey-callout">
          <p className="section-label">YOUR EXPERIENCE</p>

          <h2>Ready for the survey?</h2>

          <p>
            Share what you learned and tell us about your
            tourism experience.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowSurvey(true)}
          >
            TAKE SURVEY →
          </button>
        </div>
      </section>

      {showSurvey && <Survey onClose={() => setShowSurvey(false)} />}
    </main>
  );
}


function OnlineExperience({ onBack }) {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <main className="tourism-page">
      <header className="tourism-header">
        <button onClick={onBack} className="back-button">
          ←
        </button>

        <div className="header-brand">
          DAPITAN
          <span>CITY TOURISM</span>
        </div>

        <span className="online-badge">ONLINE</span>
      </header>

      <section className="video-hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/dapitan-poster.jpg"
        >
          <source src="/media/dapitan-tourism.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay">
          <p className="section-label">WELCOME TO</p>

          <h1>Dapitan<br />City</h1>

          <p>Discover. Explore. Experience.</p>
        </div>
      </section>

      <section className="content-section">
        <p className="section-label">DISCOVER DAPITAN</p>

        <h2>A Journey Through History</h2>

        <p className="large-text">
          Dapitan is a city rich in history, culture, natural
          beauty, and stories waiting to be discovered.
        </p>

        <TourismCard
          title="History & Heritage"
          description="Walk through the history that makes Dapitan unique."
          image="/images/rizal-shrine.jpg"
        />

        <TourismCard
          title="Culture"
          description="Discover the traditions, people, and identity of Dapitan."
          image="/images/dapitan-heritage.jpg"
        />

        <TourismCard
          title="Adventure"
          description="Explore destinations and experiences around the city."
          image="/images/dapitan-city.jpg"
        />

        <div className="survey-callout">
          <p className="section-label">FINAL CHALLENGE</p>

          <h2>What did you think?</h2>

          <p>
            You've reached the end of the Dapitan tourism
            experience. Now tell us what you think.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowSurvey(true)}
          >
            TAKE SURVEY →
          </button>
        </div>
      </section>

      {showSurvey && <Survey onClose={() => setShowSurvey(false)} />}
    </main>
  );
}


function TourismCard({ title, description, image }) {
  return (
    <article className="tourism-card">
      <img
        src={image}
        alt={title}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      <div className="card-content">
        <p className="card-number">DISCOVER</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}


function Survey({ onClose }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="modal">
        <div className="survey-modal">
          <div className="success-icon">✓</div>

          <p className="section-label">SURVEY COMPLETE</p>

          <h2>Thank You!</h2>

          <p>
            Your response has been recorded for this
            demonstration.
          </p>

          <button className="primary-button" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="survey-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <p className="section-label">SURVEY</p>

        <h2>How was your experience?</h2>

        <p>
          Select the answer that best represents your
          experience.
        </p>

        <div className="poll-options">
          {[
            "Excellent",
            "Good",
            "Average",
            "Needs Improvement",
          ].map((option) => (
            <button
              key={option}
              className={
                answer === option
                  ? "poll-option selected"
                  : "poll-option"
              }
              onClick={() => setAnswer(option)}
            >
              <span>
                {answer === option ? "●" : "○"}
              </span>

              {option}
            </button>
          ))}
        </div>

        <button
          className="primary-button"
          disabled={!answer}
          onClick={() => setSubmitted(true)}
        >
          SUBMIT RESPONSE
        </button>
      </div>
    </div>
  );
}

export default App;