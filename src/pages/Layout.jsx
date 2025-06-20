import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, User, Settings, GraduationCap } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navigation = [
    { name: "Home", href: createPageUrl("Home"), icon: Home },
    { name: "Studies", href: createPageUrl("Studies"), icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen pastel-bg">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&amp;display=swap" rel="stylesheet" />
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
            font-family: 'Poppins', sans-serif;
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

          .pastel-bg {
            background: linear-gradient(to bottom right, #f5ebe0, #fff1e6);
          }
        `}
      </style>
      
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3D52A0] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">StudyHub</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const pastelColors = {
                  Home: "bg-[#fff1e6]",
                  Studies: "bg-[#eae4e9]",
                  Default: "bg-[#fde2e4]"
                };

                const buttonColor = pastelColors[item.name] || pastelColors.Default;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? `${buttonColor} text-[#3D52A0] shadow-sm`
                        : `${buttonColor} text-slate-600 hover:brightness-110`
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
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
