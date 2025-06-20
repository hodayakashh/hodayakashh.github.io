import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, User, Settings, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/languageToggle";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const { i18n } = useTranslation();

  const navigation = [
    { name: "Home", href: createPageUrl("Home"), icon: Home },
    { name: "Studies", href: createPageUrl("Studies"), icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#EDE8F5]">
      <style>
        {`
          :root {
            --primary-color: 61 82 160;   /* #3D52A0 */
            --secondary-color: 112 145 230; /* #7091E6 */
            --accent-color-1: 134 151 196; /* #8697C4 */
            --accent-color-2: 173 187 212; /* #ADBBD4 */
            --background-color: 237 232 245; /* #EDE8F5 */
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1e293b; /* slate-800 */
          }
          
          .glass-effect {
            backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(255, 255, 255, 0.75);
            border: 1px solid rgba(203, 213, 225, 0.5); /* slate-300/50 */
          }

          .text-gradient {
            background: linear-gradient(135deg, #3D52A0 0%, #7091E6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3D52A0] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Hodaya's Personal Studyhub</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white text-[#3D52A0] shadow-sm"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
