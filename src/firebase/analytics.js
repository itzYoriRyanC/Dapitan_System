import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

/* =========================================================
   VISITOR ID
   ---------------------------------------------------------
   Creates one anonymous ID for this browser.
   It is stored locally so refreshing the page does not
   create another person.
========================================================= */

const VISITOR_ID_KEY = "dapitan_visitor_id";

export function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId =
      "visitor_" +
      crypto.randomUUID();

    localStorage.setItem(
      VISITOR_ID_KEY,
      visitorId
    );
  }

  return visitorId;
}

/* =========================================================
   RECORD VISIT
   ---------------------------------------------------------
   Records one visit per visitor per day.
========================================================= */

export async function recordVisit(mode = "online") {
  if (mode !== "online") {
    return;
  }

  try {
    const visitorId = getVisitorId();

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const visitKey =
      `dapitan_visit_${today}`;

    const alreadyVisitedToday =
      localStorage.getItem(visitKey);

    if (alreadyVisitedToday === visitorId) {
      return;
    }

    await addDoc(
      collection(db, "analytics_visits"),
      {
        visitorId,
        mode,
        date: today,
        timestamp: serverTimestamp(),
      }
    );

    localStorage.setItem(
      visitKey,
      visitorId
    );

  } catch (error) {
    console.error(
      "Analytics visit error:",
      error
    );
  }
}

/* =========================================================
   GET VISITS
========================================================= */

export async function getAnalyticsVisits() {
  const visitsQuery = query(
    collection(db, "analytics_visits"),
    orderBy("timestamp", "asc")
  );

  const snapshot =
    await getDocs(visitsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* =========================================================
   GET UNIQUE VISITORS
========================================================= */

export async function getUniqueVisitors() {
  const visits =
    await getAnalyticsVisits();

  const uniqueIds =
    new Set(
      visits
        .map((visit) => visit.visitorId)
        .filter(Boolean)
    );

  return uniqueIds.size;
}