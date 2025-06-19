
import React, { useState, useEffect } from "react";
import { fetchStudyYears, fetchCoursesByYear } from "@/api/firebaseApi";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Studies() {
  const [studyYears, setStudyYears] = useState([]);
  const [courseCounts, setCourseCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const yearsData = await fetchStudyYears();

      const coursePromises = yearsData.map((year) =>
        fetchCoursesByYear(year.id).then((courses) => ({
          yearId: year.id,
          count: courses.length,
        }))
      );

      const courseCountsArray = await Promise.all(coursePromises);

      const counts = courseCountsArray.reduce((acc, item) => {
        acc[item.yearId] = item.count;
        return acc;
      }, {});

      setStudyYears(yearsData);
      setCourseCounts(counts);
    } catch (error) {
      console.error("Error loading study data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D52A0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">Academic Years</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Select an academic year to explore the courses and study materials.
        </p>
      </motion.div>

      {studyYears.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-slate-600">No Study Years Added</h3>
          <p className="text-slate-500">Your academic years will appear here once you add them in the admin panel.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {studyYears.map((year, index) => (
            <motion.div
              key={year.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/year?id=${year.id}`} className="block group">
                <Card className="bg-white/80 border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-slate-900 group-hover:text-[#3D52A0] transition-colors">{year.name}</CardTitle>
                      <div className="w-12 h-12 bg-[#3D52A0] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {year.year_number}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-slate-600 mb-4 h-12">
                      {year.description || `Explore ${courseCounts[year.id] || 0} courses from my ${year.name.toLowerCase()}.`}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-[#EDE8F5] border-[#ADBBD4]">
                        {courseCounts[year.id] || 0} Courses
                      </Badge>
                      <div className="flex items-center text-[#3D52A0] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Year
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
