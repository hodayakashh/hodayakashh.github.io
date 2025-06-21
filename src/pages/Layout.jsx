import React from "react";
import { Link, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { createPageUrl } from "@/utils";
import { Home, BookOpen, User, Settings, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/languageToggle";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t("navigation.home"), href: createPageUrl("Home"), icon: Home },
    { name: t("navigation.studies"), href: createPageUrl("Studies"), icon: BookOpen },
  ];

  const isActive = (href) => location.pathname === href;
  const isHomePage = location.pathname === createPageUrl("Home") || location.pathname === '/';

  const getPageBackground = () => {
    const { pathname } = location;
    if (pathname === '/' || pathname.toLowerCase() === '/home') {
      return `url('/gradient-background.png')`;
    }
    if (pathname.toLowerCase().startsWith('/studies') || pathname.toLowerCase().startsWith('/year')) {
      return `url('/gradient-background2.png')`;
    }
    return null;
  }

  const backgroundUrl = getPageBackground();

  return (
    <div className={`min-h-screen relative ${!backgroundUrl && 'bg-[#EDE8F5]'}`}>
       {backgroundUrl && (
        <>
          <div 
            className="fixed inset-0 -z-20 bg-cover bg-center animate-pan"
            style={{ backgroundImage: backgroundUrl }}
          />
          <div className="fixed inset-0 -z-10">
            <Lottie 
              animationData={{ "v": "5.5.7", "fr": 24, "ip": 0, "op": 120, "w": 1920, "h": 1080, "nm": "Particle", "ddd": 0, "assets": [], "layers": [ { "ddd": 0, "ind": 1, "ty": 4, "nm": "particle 2", "sr": 1, "ks": { "o": { "a": 1, "k": [ { "i": { "x": [ 0.833 ], "y": [ 0.833 ] }, "o": { "x": [ 0.167 ], "y": [ 0.167 ] }, "t": 0, "s": [ 0 ] }, { "i": { "x": [ 0.833 ], "y": [ 0.833 ] }, "o": { "x": [ 0.167 ], "y": [ 0.167 ] }, "t": 60, "s": [ 100 ] }, { "t": 120, "s": [ 0 ] } ], "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 1, "k": [ { "i": { "x": 0.667, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 0, "s": [ 1920, 1080, 0 ], "to": [ 0, -270, 0 ], "ti": [ 0, 0, 0 ] }, { "t": 120, "s": [ 1920, 0, 0 ] } ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100, 100 ], "ix": 6 } }, "ao": 0, "shapes": [ { "ty": "gr", "it": [ { "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 0, "k": { "i": [ [ 0, 0 ], [ 0, 0 ] ], "o": [ [ 0, 0 ], [ 0, 0 ] ], "v": [ [ -0.5, 0 ], [ 0.5, 0 ] ], "c": false } }, "nm": "Path 1", "mn": "ADBE Vector Shape - Line", "hd": false }, { "ty": "st", "c": { "a": 0, "k": [ 1, 1, 1, 1 ], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 1, "ix": 5 }, "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "Stroke 1", "mn": "ADBE Vector Graphic - Stroke", "hd": false }, { "ty": "rp", "c": { "a": 0, "k": 200, "ix": 1 }, "o": { "a": 0, "k": 0, "ix": 2 }, "tr": { "r": { "a": 1, "k": [ { "i": { "x": [ 0.667 ], "y": [ 1 ] }, "o": { "x": [ 0.333 ], "y": [ 0 ] }, "t": 0, "s": [ 0 ] }, { "t": 120, "s": [ 360 ] } ], "ix": 10 }, "p": { "a": 0, "k": [ 0, 0 ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100 ], "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 11 } }, "bm": 0, "nm": "Repeater 1", "mn": "ADBE Repeater", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [ 0, 0 ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100 ], "ix": 6 }, "r": { "a": 0, "k": 0, "ix": 10 }, "o": { "a": 0, "k": 100, "ix": 11 }, "sk": { "a": 0, "k": 0, "ix": 7 }, "sa": { "a": 0, "k": 0, "ix": 8 } } ], "nm": "Group 1" } ], "ip": 0, "op": 120, "st": 0, "bm": 0 }, { "ddd": 0, "ind": 2, "ty": 4, "nm": "particle 1", "sr": 1, "ks": { "o": { "a": 1, "k": [ { "i": { "x": [ 0.833 ], "y": [ 0.833 ] }, "o": { "x": [ 0.167 ], "y": [ 0.167 ] }, "t": 0, "s": [ 0 ] }, { "i": { "x": [ 0.833 ], "y": [ 0.833 ] }, "o": { "x": [ 0.167 ], "y": [ 0.167 ] }, "t": 60, "s": [ 100 ] }, { "t": 120, "s": [ 0 ] } ], "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 1, "k": [ { "i": { "x": 0.667, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 0, "s": [ 0, 0, 0 ], "to": [ 0, -270, 0 ], "ti": [ 0, 0, 0 ] }, { "t": 120, "s": [ 0, 1080, 0 ] } ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100, 100 ], "ix": 6 } }, "ao": 0, "shapes": [ { "ty": "gr", "it": [ { "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 0, "k": { "i": [ [ 0, 0 ], [ 0, 0 ] ], "o": [ [ 0, 0 ], [ 0, 0 ] ], "v": [ [ -0.5, 0 ], [ 0.5, 0 ] ], "c": false } }, "nm": "Path 1", "mn": "ADBE Vector Shape - Line", "hd": false }, { "ty": "st", "c": { "a": 0, "k": [ 1, 1, 1, 1 ], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 1, "ix": 5 }, "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "Stroke 1", "mn": "ADBE Vector Graphic - Stroke", "hd": false }, { "ty": "rp", "c": { "a": 0, "k": 200, "ix": 1 }, "o": { "a": 0, "k": 0, "ix": 2 }, "tr": { "r": { "a": 1, "k": [ { "i": { "x": [ 0.667 ], "y": [ 1 ] }, "o": { "x": [ 0.333 ], "y": [ 0 ] }, "t": 0, "s": [ 0 ] }, { "t": 120, "s": [ 360 ] } ], "ix": 10 }, "p": { "a": 0, "k": [ 0, 0 ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100 ], "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 11 } }, "bm": 0, "nm": "Repeater 1", "mn": "ADBE Repeater", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [ 0, 0 ], "ix": 2 }, "a": { "a": 0, "k": [ 0, 0 ], "ix": 1 }, "s": { "a": 0, "k": [ 100, 100 ], "ix": 6 }, "r": { "a": 0, "k": 0, "ix": 10 }, "o": { "a": 0, "k": 100, "ix": 11 }, "sk": { "a": 0, "k": 0, "ix": 7 }, "sa": { "a": 0, "k": 0, "ix": 8 } } ], "nm": "Group 1" } ], "ip": 0, "op": 120, "st": 0, "bm": 0 } ] }}
              className="w-full h-full opacity-50"
              style={{ filter: 'invert(1)' }}
            />
          </div>
        </>
      )}
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
              <div className="w-14 h-14">
                <DotLottieReact
                  src="https://lottie.host/16079e96-c6e7-4d84-9a73-22179ec63c7c/jPF3KFof2p.lottie"
                  loop
                  autoplay
                  speed={0.5}
                  segment={[0, 30]}
                />
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
