import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

export async function fetchStudyYears() {
  const querySnapshot = await getDocs(collection(db, "studyYears"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchCoursesByYear(studyYearId) {
  const coursesRef = collection(db, "studyYears", studyYearId, "courses");
  const querySnapshot = await getDocs(coursesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchMaterials(studyYearId, courseId) {
  const materialsRef = collection(db, "studyYears", studyYearId, "courses", courseId, "materials");
  const querySnapshot = await getDocs(materialsRef);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      uploadDate: data.uploadDate // לשימור ה־Timestamp במפורש
    };
  });
}