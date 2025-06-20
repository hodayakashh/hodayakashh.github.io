import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PdfPreview({ fileUrl, title, uploadDate }) {
  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const loadingTimeout = useRef(null);

  if (!fileUrl) return null;

  const getFullViewerUrl = (url) => {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  };

  const handleIframeLoad = () => {
    clearTimeout(loadingTimeout.current);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleIframeError = () => {
    clearTimeout(loadingTimeout.current);
    setPreviewError(true);
    setIsLoading(false);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(fileUrl, '_blank');
  };
  
  const handleFullView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getFullViewerUrl(fileUrl), '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    setIsLoading(true);
    setPreviewError(false);
    // Set timeout for loading - if it takes too long, show error
    loadingTimeout.current = setTimeout(() => {
      handleIframeError();
    }, 10000);

    return () => {
      clearTimeout(loadingTimeout.current);
    };
  }, [fileUrl]);

  useEffect(() => {
    const fetchLikes = async () => {
      const docRef = doc(db, "likes", title);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikeCount(docSnap.data().count || 0);
      }
    };
    const fetchDownloads = async () => {
      const docRef = doc(db, "downloads", title);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDownloadCount(docSnap.data().count || 0);
      }
    };
    if (title) {
      fetchLikes();
      fetchDownloads();
    }
  }, [title]);

  const handleLike = async () => {
    try {
      const docRef = doc(db, "likes", title);
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      setLikeCount(prev => prev + 1);
    } catch (error) {
      console.error("Failed to update like count:", error);
    }
  };

  return (
    <motion.div 
      className="border rounded-xl overflow-hidden bg-white shadow-lg flex flex-col h-full group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-grow h-[400px] bg-slate-50">
        {previewError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
            <AlertCircle className="w-12 h-12 mb-3 text-slate-400" />
            <p className="text-sm font-semibold mb-2">PDF preview unavailable</p>
            <p className="text-xs text-slate-400 mb-4">
              Unable to load preview. Use the buttons below to open or download the file.
            </p>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <span className="text-sm text-slate-600">Loading preview...</span>
                </div>
              </div>
            )}
            <iframe
              src={fileUrl}
              title={`PDF Preview: ${title}`}
              className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="autoplay; encrypted-media"
            />
          </>
        )}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors pointer-events-none"></div>
      </div>
      
      <div className="p-4 bg-white border-t space-y-3">
        <div className="flex items-start gap-2">
          {/* <FileText className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" /> - This line was removed */}
          <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-tight">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-3 h-3" />
            {console.log("uploadDate:", uploadDate)}
            <span>Uploaded: {uploadDate?.toDate ? format(uploadDate.toDate(), "MMM d, yyyy") : "Unknown"}</span>        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2 bg-white hover:bg-slate-50"
            onClick={handleLike}
          >
            
            <span>Thank you! 👍</span>
          </Button>
          <div className="flex items-center gap-1 text-slate-600 text-sm">
            👏 <span>{likeCount}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2 bg-white hover:bg-slate-50"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
