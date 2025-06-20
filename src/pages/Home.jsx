import React, { useState, useEffect, useCallback } from "react";
import { Github, Linkedin, ArrowRight, BookOpen, FileText, Calculator, PenTool, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import LinkedInPost from "../components/social/LinkedInPost";
import { db } from "@/lib/firebase";
import { collection, collectionGroup, getDocs, addDoc, updateDoc, doc, query, orderBy, limit } from "firebase/firestore";
import localAvatar from "@/media/profile.jpeg";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation('home');
  const [profile, setProfile] = useState(null);
  const [featuredMaterials, setFeaturedMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const profilesSnapshot = await getDocs(collection(db, "profiles"));
      let profileData;
      const newAvatarUrl = localAvatar;
      if (profilesSnapshot.empty) {
        const newProfile = {
          name: "Hodaya Kashkash",
          title: "Computer Science Student, Bar-Ilan University",
          bio: `Welcome to my personal study hub!

          Throughout my academic journey, I've compiled useful materials and insights that make complex topics more approachable.

          What can you find on this site? 
          Comprehensive course summaries, homework solutions, quick exam review sheets, and other resources.`,         
          github_url: "https://github.com/hodayakashh",
          linkedin_url: "https://linkedin.com/in/hodayakash",
          avatar_url: newAvatarUrl
        };
        const docRef = await addDoc(collection(db, "profiles"), newProfile);
        profileData = { id: docRef.id, ...newProfile };
      } else {
        const profileDoc = profilesSnapshot.docs[0];
        profileData = { id: profileDoc.id, ...profileDoc.data() };
        const updates = {};
        if (profileData.linkedin_url !== 'https://linkedin.com/in/hodayakash') {
          updates.linkedin_url = 'https://linkedin.com/in/hodayakash';
        }
        if (profileData.github_url !== 'https://github.com/hodayakashh') {
          updates.github_url = 'https://github.com/hodayakashh';
        }
        if (profileData.avatar_url !== newAvatarUrl) {
          updates.avatar_url = newAvatarUrl;
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "profiles", profileData.id), updates);
          profileData = { ...profileData, ...updates };
        }
      }
      
      setProfile(profileData);

      // Fetch years, then courses for each year, then materials for each course
      const yearsSnapshot = await getDocs(collection(db, "studyYears"));
      const allMaterials = [];

      for (const yearDoc of yearsSnapshot.docs) {
        const yearId = yearDoc.id;
        const coursesSnapshot = await getDocs(collection(db, "studyYears", yearId, "courses"));
        
        for (const courseDoc of coursesSnapshot.docs) {
          const courseId = courseDoc.id;
          const materialsSnapshot = await getDocs(collection(db, "studyYears", yearId, "courses", courseId, "materials"));

          for (const materialDoc of materialsSnapshot.docs) {
            allMaterials.push({ id: materialDoc.id, ...materialDoc.data() });
          }
        }
      }

      const sortedMaterials = allMaterials
        .filter(m => m.created_date)
        .sort((a, b) => b.created_date.toDate() - a.created_date.toDate());

      setFeaturedMaterials(sortedMaterials);
      setTotalMaterials(allMaterials.length);

      const courseSnapshot = await getDocs(collectionGroup(db, "courses"));
      setTotalCourses(courseSnapshot.size);

      const downloadsSnapshot = await getDocs(collection(db, "downloads"));
      const totalDownloadsCount = downloadsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + (typeof data.count === 'number' ? data.count : 0);
      }, 0);
      setTotalDownloads(totalDownloadsCount);

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const materialIcons = {
    lecture: BookOpen,
    summary: FileText,
    formula_sheet: Calculator,
    homework: PenTool
  };

  const materialColors = {
    lecture: "from-[#3D52A0] to-[#4c65c1]",
    summary: "from-[#7091E6] to-[#8697C4]", 
    formula_sheet: "from-[#8697C4] to-[#ADBBD4]",
    homework: "from-[#ADBBD4] to-[#c0cfe8]"
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D52A0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden p-1 bg-white/80 shadow-lg">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-[#8697C4] to-[#7091E6] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {profile?.name ? profile.name.charAt(0) : "S"}
              </span>
            )}
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gradient mb-4">
          {t("title", { name: profile?.name || "StudyHub" })}
        </h1>
        
        {profile?.title && (
          <p className="text-xl text-slate-600 mb-6">
            {t("subtitle", { title: profile?.title })}
          </p>
        )}
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            {t("bio")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={createPageUrl("Studies")}>
            <Button size="lg" className="bg-[#3D52A0] hover:bg-opacity-90 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
              {t("exploreStudies")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Social Links */}
      {(profile?.github_url || profile?.linkedin_url) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto"
        >
          {profile?.github_url && (
            <Card className="bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <a 
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-slate-700 group-hover:text-[#3D52A0]"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">GitHub</h3>
                    <p className="text-slate-500">{t("viewProjects")}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardContent>
            </Card>
          )}

          {profile?.linkedin_url && (
            <Card className="bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <a 
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-slate-700 group-hover:text-[#3D52A0]"
                >
                  <div className="w-12 h-12 bg-[#3D52A0] rounded-lg flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">LinkedIn</h3>
                    <p className="text-slate-500">{t("professionalProfile")}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Recent LinkedIn Posts */}
      {profile?.linkedin_url && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              {t("recentPosts")}
            </h2>
          </div>

          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <LinkedInPost
                profileImage={profile?.avatar_url}
                profileName={profile?.name}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Featured Materials */}
      {featuredMaterials.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              {t("featuredMaterials")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t("quickAccess")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMaterials.map((material, index) => {
              const Icon = materialIcons[material.type] || FileText;
              const colorClass = materialColors[material.type] || "from-slate-500 to-slate-600";
              
              return (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#3D52A0] transition-colors">
                            {material.title}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-[#EDE8F5] text-slate-600 text-sm rounded-full mb-3">
                            {material.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          {material.content && (
                            <p className="text-slate-600 text-sm line-clamp-2">
                              {material.content.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: t("stats.materials"), count: totalMaterials, icon: FileText },
            { label: t("stats.years"), count: "2+", icon: BookOpen },
            { label: t("stats.courses"), count: totalCourses, icon: Calculator },
            { label: t("stats.downloads"), count: totalDownloads, icon: Download }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 rounded-xl p-6 border-0 shadow-lg">
              <stat.icon className="w-8 h-8 text-[#7091E6] mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{stat.count}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
