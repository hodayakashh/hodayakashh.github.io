
import React, { useState, useEffect } from "react";
import { getCourses, createCourse } from "@/lib/firebase/courses";
import { getStudyYears } from "@/lib/firebase/studyYears";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseManager({ onStatsChange }) {
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    name: "",
    year_id: "",
    semester: "",
    description: "",
    color: "#3D52A0"
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, yearsData] = await Promise.all([
        getCourses(),
        getStudyYears()
      ]);
      setCourses(coursesData);
      setYears(yearsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      await createCourse(newCourse);
      setNewCourse({
        name: "",
        year_id: "",
        semester: "",
        description: "",
        color: "#3D52A0"
      });
      setShowAddForm(false);
      loadData();
      onStatsChange();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };


  const getYearName = (yearId) => {
    const year = years.find(y => y.id === yearId);
    return year ? year.name : "Unknown Year";
  };

  const semesterColors = {
    A: "bg-blue-100 text-blue-800",
    B: "bg-emerald-100 text-emerald-800",
    summer: "bg-cyan-100 text-cyan-800"
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Courses</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#3D52A0] hover:bg-opacity-90 text-white"
          disabled={years.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {years.length === 0 && (
        <div className="text-center py-6 text-slate-500 bg-amber-50 rounded-lg border border-amber-200">
          <p>Please add study years first before creating courses.</p>
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-blue-50/50 border-[#7091E6]/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Add New Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-course-name">Course Name</Label>
                  <Input
                    id="new-course-name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Study Year</Label>
                    <Select value={newCourse.year_id} onValueChange={(value) => setNewCourse({...newCourse, year_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={newCourse.semester} onValueChange={(value) => setNewCourse({...newCourse, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Semester A</SelectItem>
                        <SelectItem value="B">Semester B</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="new-course-color">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="new-course-color"
                          type="text" // Keep as text, as it's a hex string
                          value={newCourse.color}
                          onChange={(e) => setNewCourse({...newCourse, color: e.target.value})}
                        />
                        <div className="w-8 h-8 rounded" style={{backgroundColor: newCourse.color}} />
                      </div>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-course-description">Description</Label>
                  <Textarea
                    id="new-course-description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Course description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCourse}
                    disabled={!newCourse.name || !newCourse.year_id}
                    className="bg-[#3D52A0] hover:bg-opacity-90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="bg-white border border-slate-200"
              style={{ borderLeft: `4px solid ${course.color || '#3D52A0'}` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: course.color || '#3D52A0'}}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-lg text-slate-900">{course.name}</h4>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-slate-600 mb-2">
                        <span className="font-medium">{getYearName(course.year_id)}</span>
                        {course.semester && (
                          <Badge className={`text-xs ${semesterColors[course.semester]}`}>
                            Semester {course.semester}
                          </Badge>
                        )}
                      </div>
                      {course.description && (
                        <p className="text-sm text-slate-600 max-w-2xl">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && years.length > 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-4">📖</div>
          <p>No courses added yet. Click "Add Course" to get started!</p>
        </div>
      )}
    </div>
  );
}
