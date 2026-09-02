import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./config";

export async function getSurvey(surveyId = "dapitan-main") {
  const surveyRef = doc(db, "surveys", surveyId);

  const surveySnapshot = await getDoc(surveyRef);

  if (!surveySnapshot.exists()) {
    throw new Error("Survey does not exist.");
  }

  const questionsRef = collection(
    db,
    "surveys",
    surveyId,
    "questions"
  );

  const questionsQuery = query(
    questionsRef,
    orderBy("order", "asc")
  );

  const questionsSnapshot = await getDocs(questionsQuery);

  const questions = questionsSnapshot.docs.map((question) => ({
    id: question.id,
    ...question.data(),
  }));

  return {
    id: surveySnapshot.id,
    ...surveySnapshot.data(),
    questions,
  };
}