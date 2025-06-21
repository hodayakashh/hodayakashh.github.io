import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next"; // Import useTranslation for i18n support
import i18n from "@/i18n"; // Import i18n instance for language support

export default function YearManager({ onStatsChange }) {
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newYear, setNewYear] = useState({ name: "", year_number: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    try {
      const q = query(collection(db, "studyYears"), orderBy("year_number"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setYears(data);
    } catch (error) {
      console.error("Error loading years:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddYear = async () => {
    try {
      await addDoc(collection(db, "studyYears"), {
        ...newYear,
        year_number: parseInt(newYear.year_number)
      });
      setNewYear({ name: "", year_number: "", description: "" });
      setShowAddForm(false);
      loadYears();
      onStatsChange();
    } catch (error) {
      console.error("Error adding year:", error);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading years...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Study Years</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#3D52A0] hover:bg-opacity-90 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Year
        </Button>
      </div>

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
                <CardTitle className="text-lg">Add New Study Year</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-year-name">Year Name</Label>
                    <Input
                      id="new-year-name"
                      value={newYear.name.en}
                      onChange={(e) => setNewYear({...newYear, name: e.target.value})}
                      placeholder="e.g., First Year, Sophomore Year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-year-number">Year Number</Label>
                    <Input
                      id="new-year-number"
                      type="number"
                      value={newYear.year_number}
                      onChange={(e) => setNewYear({...newYear, year_number: e.target.value})}
                      placeholder="1, 2, 3..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddYear}
                    disabled={!newYear.name || !newYear.year_number}
                    className="bg-[#3D52A0] hover:bg-opacity-90 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Year
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {years.map((year) => (
          <motion.div
            key={year.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900">{year.name.en}</h4>
                    <p className="text-sm text-slate-600">Year {year.year_number}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {years.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="text-4xl mb-4">📚</div>
          <p>No study years added yet. Click "Add Year" to get started!</p>
        </div>
      )}
    </div>
  );
}
