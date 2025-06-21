
import React, { useState, useEffect } from "react";
import { fetchMaterials, fetchCoursesByYear, fetchStudyYears } from "@/api/firebaseApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, Calculator, PenTool, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Import useTranslation for i18n support
import i18n from "@/i18n"; // Import i18n instance for language support

export default function MaterialManager() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materialsData, coursesData, yearsData] = await Promise.all([
        await fetchMaterials(),
        await fetchCoursesByYear(),
        await fetchStudyYears()
      ]);
      setMaterials(materialsData);
      setCourses(coursesData);
      setYears(yearsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name?.[i18n.language] || course.name?.en : "Unknown Course";
  };

  const getCourseYear = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return "Unknown";
    const year = years.find(y => y.id === course.year_id);
    return year ? year.name?.[i18n.language] || year.name?.en : "Unknown Year";
  };

  const materialIcons = {
    lecture: BookOpen,
    summary: FileText,
    formula_sheet: Calculator,
    homework: PenTool
  };

  const materialColors = {
    lecture: "bg-blue-100 text-blue-800 border-blue-200",
    summary: "bg-green-100 text-green-800 border-green-200",
    formula_sheet: "bg-purple-100 text-purple-800 border-purple-200",
    homework: "bg-orange-100 text-orange-800 border-orange-200"
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold text-slate-900">Study Materials</h3>
      </div>
      {courses.length === 0 && (
        <div className="text-center py-6 text-slate-500 bg-amber-50 rounded-lg border border-amber-200">
          <p>Please add courses first before creating study materials.</p>
        </div>
      )}
      <div className="space-y-4">
        {materials.map((material) => {
          const Icon = materialIcons[material.type] || FileText;
          const colorClass = materialColors[material.type] || "bg-slate-100 text-slate-800 border-slate-200";
          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-lg text-slate-900">{material.title}</h4>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <Badge className={`text-xs border ${colorClass}`}>
                          {material.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {getCourseName(material.course_id)} • {getCourseYear(material.course_id)}
                        </span>
                        {material.file_url && (
                          <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <Paperclip className="w-3 h-3" />
                            View File
                          </a>
                        )}
                      </div>
                      {material.content && (
                        <p className="text-sm text-slate-600 mb-2 max-w-2xl">
                          {material.content.substring(0, 150)}...
                        </p>
                      )}
                      {material.tags && material.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {material.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {materials.length === 0 && courses.length > 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-4">📝</div>
          <p>No study materials added yet.</p>
        </div>
      )}
    </div>
  );
}
