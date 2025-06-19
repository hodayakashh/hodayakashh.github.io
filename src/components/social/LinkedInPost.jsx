import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinkedInPost({ profileImage, profileName = "Hodaya Kashkash" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(138);

  const fullText = `ביום שבו הורידו את Friends מהפלטפורמה האהובה עליי – נשבר לי הלב 💔 
אז בניתי אחת משלי.

🍒 כחלק מקורס תכנות מתקדם ולאחר חודשים של עבודה בנינו את StreamCherry – מערכת סטרימינג מקצה לקצה, שמשלבת אפליקציית Web, אפליקציית מובייל, Backend ומנוע המלצות חכם.

אז מה יש ב־StreamCherry?

💻 ממשק Web ב־React עם ניהול הרשאות ו־Context
📱 אפליקציית Android ב־Java, לפי ארכיטקטורת MVVM
🔐 Backend ב־JavaScript (Node.js) עם Express, JWT והרשאות לפי תפקיד
🧠 מנוע המלצות חכם ב־++C עם multithreading והתאמה לדפוסי צפייה
🗃️ ניהול Data דינמי ב־MongoDB – מותאם לסוגי תוכן והרגלי שימוש
🐳 Docker – קונטיינריזציה מלאה לכל רכיב במערכת

👩‍💻 מעבר לטכנולוגיה, למדנו איך לחבר רכיבים שלא מדברים את אותה שפה – ולהפוך אותם למערכת אחת מתואמת.
זו הייתה הזדמנות להבין איך נראית מערכת מורכבת באמת: לתכנן נכון, לעבוד יחד, ולגרום לכל החלקים להתממשק בהרמוניה.

וכמובן, למי שתהה –
לא, לא העלינו את Friends 😅
(יש גבול למה ש־Docker יכול להריץ בלי לערב עורכי דין.)

♨️ אז בין אם אתם מגייסים/מגייסות שמחפשים סטודנטית חרוצה עם אהבה אמיתית לפיתוח – או פשוט אנשים שנשבר להם הלב כשFriends ירדה מהמסך – 
אתם יותר ממוזמנים לכתוב לי 🤗 

💬 מוזמנים לשאול, להעיר או פשוט לשתף מחשבות על הפרויקט.

📂 הקוד המלא מחכה כאן: https://lnkd.in/dqqCx5xs`;
  
  const shortText = `ביום שבו הורידו את Friends מהפלטפורמה האהובה עליי – נשבר לי הלב 💔 \nאז בניתי אחת משלי.`;
  const shouldShowMore = true;

  const handlePostClick = () => {
    window.open("https://www.linkedin.com/posts/hodayakash_opentowork-techcareer-csstudent-activity-7328388418583855106-QQDx?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC5YDeABYDePPQR1CUddveg4Hy_8PRjlRGQ", '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full max-w-4xl mx-auto cursor-pointer" onClick={handlePostClick}>
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <img 
              src={profileImage} 
              alt={profileName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm">{profileName}</h3>
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-600 text-sm">• You</span>
              </div>
              <p className="text-gray-600 text-xs">Computer Science Student | Bar Ilan University</p>
              <div className="flex items-center space-x-1 text-gray-500 text-xs mt-1">
                <span>1mo</span>
                <span>•</span>
                <span>Edited</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <div dir="rtl" className="text-right">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {fullText}
                </p>
                {shouldShowMore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="text-gray-600 text-sm mt-1 hover:underline"
                  >
                    ...less
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {shortText}
                  {shouldShowMore && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(true);
                      }}
                      className="text-gray-600 hover:underline"
                    >
                      ...more
                    </button>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Video Content */}
      <div className="px-4 pb-3">
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video 
            className="w-full h-64 object-cover"
            controls
            preload="metadata"
            poster="https://firebasestorage.googleapis.com/v0/b/hodayakashkash-85596.firebasestorage.app/o/images%2Fstreamcherry_cover.png?alt=media&token=48ae473a-21aa-4ed6-8b91-20a52eb77b46"
            onClick={(e) => e.stopPropagation()}
          >
            <source src="https://firebasestorage.googleapis.com/v0/b/hodayakashkash-85596.firebasestorage.app/o/images%2FStreamCherry.mov?alt=media&token=dfcbcb69-2fd2-4f8a-973c-e71af4681cf8" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Reactions Bar - Only Likes Count */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">👍</div>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">❤️</div>
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs">😮</div>
              </div>
              <span>{likes + 1} likes</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>50 comments</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
