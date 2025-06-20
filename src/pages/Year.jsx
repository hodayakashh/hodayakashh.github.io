import React, { useState, useEffect } from "react";
import { fetchStudyYears, fetchCoursesByYear, fetchMaterials } from "@/api/firebaseApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, FileText, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import PdfPreview from "../components/studies/PdfPreview";
import { useTranslation } from "react-i18next";

// פונקציית עזר לקבלת ערך מתורגם
const getTranslatedValue = (field, i18n) => {
  if (typeof field === "string") return field;
  return field?.[i18n.language] || field?.en || "";
};

export default function YearPage() {
  const { t, i18n } = useTranslation("year");

  const [year, setYear] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materialsByCourse, setMaterialsByCourse] = useState({});
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const yearId = urlParams.get("id");
    console.log("Year ID from URL:", yearId);
    if (yearId) {
      loadData(yearId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadData = async (yearId) => {
    try {
      const studyYears = await fetchStudyYears();
      const yearData = studyYears.find((y) => y.id === yearId);
      setYear(yearData);

      const coursesData = await fetchCoursesByYear(yearId);
      setCourses(coursesData);

      const materialsGrouped = {};
      for (const course of coursesData) {
        const materials = await fetchMaterials(yearId, course.id);
        materialsGrouped[course.id] = materials;
      }

      setMaterialsByCourse(materialsGrouped);
    } catch (error) {
      console.error("Error loading year data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const newSemesterColors = {
    A: "bg-[#E0DAEE] text-[#3D52A0] border-[#ADBBD4]",
    B: "bg-[#E0DAEE] text-[#3D52A0] border-[#ADBBD4]",
    summer: "bg-[#E0DAEE] text-[#3D52A0] border-[#ADBBD4]",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D52A0]"></div>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-700">{t("yearNotFound")}</h2>
        <p className="text-slate-500 mt-2">{t("yearNotFoundMessage")}</p>
        <Link to={createPageUrl("Studies")} className="mt-6 inline-block">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToStudies")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to={createPageUrl("Studies")}
          className="inline-flex items-center text-slate-600 hover:text-[#3D52A0] mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          {t("backAcademicYears")}
        </Link>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {getTranslatedValue(year.name, i18n)}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {getTranslatedValue(year.description, i18n)}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {courses.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-600">{t("noCoursesAdded")}</h3>
            <p className="text-slate-500">{t("noCoursesMessage")}</p>
          </motion.div>
        ) : (
          courses.map((course, courseIndex) => {
            const courseMaterials = materialsByCourse[course.id] || [];
            const isCourseExpanded = expandedCourses.has(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: courseIndex * 0.1 }}
              >
                <Card
                  className="bg-white/80 border-0 shadow-lg overflow-hidden"
                  style={{ borderLeft: `5px solid ${course.color || "#3D52A0"}` }}
                >
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <div
                        className="w-full p-6 cursor-pointer hover:bg-white/95 transition-colors"
                        onClick={() => toggleCourse(course.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: course.color || "#3D52A0" }}
                            >
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-xl font-semibold text-slate-900 truncate">
                                  {getTranslatedValue(course.name, i18n)}
                                </h3>
                              </div>
                              <div className="flex items-center space-x-3 text-sm text-slate-600">
                                  {course.semester?.en && (
                                    <Badge className={`text-xs ${newSemesterColors[course.semester.en]}`}>
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {t("semester", { semester: course.semester?.[i18n.language] || course.semester?.en })}
                                    </Badge>
                                  )}
                              </div>
                              {course.description?.[i18n.language] || course.description?.en ? (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                  {getTranslatedValue(course.description, i18n)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="bg-white/70 border-[#ADBBD4]">
                              {courseMaterials.length} {t("files")}
                            </Badge>
                            {isCourseExpanded ? (
                              <ChevronDown className="w-6 h-6 text-slate-400 transition-transform duration-200" />
                            ) : (
                              <ChevronRight className="w-6 h-6 text-slate-400 transition-transform duration-200" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <AnimatePresence>
                      {isCourseExpanded && (
                        <CollapsibleContent>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-[#ADBBD4]/50"
                          >
                            <CardContent className="p-6 bg-slate-50">
                              {courseMaterials.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                  <p>{t("noMaterialsUploaded")}</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {courseMaterials.map((material, materialIndex) => (
                                    <motion.div
                                      key={material.id}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: materialIndex * 0.05 }}
                                    >
                                      <PdfPreview
                                        fileUrl={material.file_url}
                                        title={material.title}
                                        uploadDate={material.uploadDate}
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}