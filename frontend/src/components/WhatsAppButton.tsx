'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Direct fetch for settings to avoid any aggregated data issues
    api.get(`/cms/settings?t=${Date.now()}`).then(({ data }) => {
      const dbNumber = data.whatsapp_number;
      if (dbNumber) {
        setWhatsappNumber(dbNumber);
      } else {
        // Ultimate fallback if DB is truly empty
        setWhatsappNumber('918888888888');
      }
    }).catch(() => {
      setWhatsappNumber('918888888888');
    });
  }, []);

  if (!whatsappNumber) return null;

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="fixed bottom-10 right-10 z-[9999] flex items-center gap-4">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white text-[#1c1c1c] px-5 py-2.5 text-[11px] uppercase font-bold tracking-[0.25em] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 pointer-events-none"
          >
            Contact Support
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ borderRadius: '50%' }}
        className="relative flex items-center justify-center h-16 w-16 bg-[#25D366] shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:bg-[#20ba5a] transition-all duration-300 group overflow-hidden"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing Outer Ring */}
        <span style={{ borderRadius: '50%' }} className="absolute inset-0 bg-[#25D366] animate-ping opacity-20"></span>
        
        {/* WhatsApp High-Def Logo */}
        <svg 
          viewBox="0 0 32 32" 
          className="h-10 w-10 text-white fill-current relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.733 5.48 2.014 7.788L0 32l8.44-2.215c2.22 1.39 4.834 2.215 7.56 2.215 8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.454 0-4.795-.718-6.786-2.073l-.487-.312-5.044 1.323 1.346-4.914-.343-.545A13.253 13.253 0 012.667 16c0-7.353 5.98-13.333 13.333-13.333S29.333 8.647 29.333 16 23.353 29.333 16 29.333zm7.333-10.124c-.403-.201-2.383-1.176-2.753-1.31-.37-.135-.638-.201-.906.201s-1.04 1.31-1.275 1.578c-.235.268-.47.302-.873.101-1.62-.811-2.658-1.424-3.714-3.235-.264-.452.264-.42.755-1.4.084-.168.042-.315-.021-.448s-.563-1.355-.771-1.854c-.201-.486-.406-.419-.563-.427-.152-.008-.326-.01-.5-.01s-.456.063-.694.315c-.238.252-.906.885-.906 2.158s.938 2.502 1.07 2.678c.131.176 1.846 2.82 4.473 3.953 1.554.671 2.163.784 2.936.71.493-.047 1.517-.62 1.73-.1.213-.1.213-.2.152-.303z"/>
        </svg>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
