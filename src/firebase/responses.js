import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

export async function submitSurvey({
  surveyId,
  answers,
  mode,
}) {
  const responseData = {
    surveyId,
    answers,
    mode,
    createdAt: serverTimestamp(),
  };

  const responseRef = await addDoc(
    collection(db, "responses"),
    responseData
  );

  return responseRef.id;
}