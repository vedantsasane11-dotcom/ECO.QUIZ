import { Award, Download, Loader2, BookOpen, AlertCircle, X, Image as ImageIcon, Share2, Link as LinkIcon, FileText, Send, MessageCircle, Twitter, Linkedin } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { useAppStore } from "../store/useAppStore";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { getCertificateTheme } from "../lib/certificateTheme";

export function Certificates() {
  const { certificates } = useAppStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<{ id: string, title: string } | null>(null);
  const [shareModalData, setShareModalData] = useState<{ id: string, title: string } | null>(null);
  
  // Store refs for each certificate container
  const certRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const generateImage = async (id: string, moduleTitle: string): Promise<string | null> => {
    // Wait before capturing to ensure fonts and styles are loaded
    await new Promise((resolve) => setTimeout(resolve, 300));
    const el = document.getElementById(`certificate-${id}`);
    if (!el) return null;
    
    const dataUrl = await toPng(el, {
      pixelRatio: 2, // High resolution
      backgroundColor: "#ffffff",
      cacheBust: true,
    });
    
    return dataUrl;
  };

  const downloadImageAction = async (id: string, moduleTitle: string) => {
    try {
      setDownloadingImageId(id);
      toast.loading("Generating High-Res Image...", { id: `img-${id}` });
      
      const imgData = await generateImage(id, moduleTitle);
      if (!imgData) throw new Error("Could not generate image");
      
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `EcoQuiz_Certificate_${moduleTitle.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image Downloaded Successfully!", { id: `img-${id}` });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image.", { id: `img-${id}` });
    } finally {
      setDownloadingImageId(null);
    }
  };

  const handleShareClick = async (id: string, moduleTitle: string) => {
    const text = `I just earned my Environmental Certification 🌱\nCheck it out here: ${window.location.origin}`;
    const url = window.location.origin;

    if (navigator.share && /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: 'My Environmental Certification',
          text,
          url
        });
        return;
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setShareModalData({ id, title: moduleTitle });
        }
        return;
      }
    }
    setShareModalData({ id, title: moduleTitle });
  };

  const executeDownload = async (id: string, moduleTitle: string) => {
    try {
      setDownloadingId(id);
      toast.loading("Generating Official PDF...", { id: `pdf-${id}` });
      
      const cert = certificates.find(c => c.id === id);
      if (!cert) throw new Error("Certificate not found");

      const theme = getCertificateTheme(cert.moduleId);

      // Calculate aspect ratio
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4" // 297 x 210 mm
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Background
      pdf.setFillColor(250, 249, 246);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      // Border
      pdf.setDrawColor(theme.pdfColors.border[0], theme.pdfColors.border[1], theme.pdfColors.border[2]);
      pdf.setLineWidth(2);
      pdf.rect(15, 15, pdfWidth - 30, pdfHeight - 30, 'S');
      pdf.setLineWidth(0.5);
      pdf.rect(17, 17, pdfWidth - 34, pdfHeight - 34, 'S');

      // Title
      pdf.setTextColor(theme.pdfColors.title[0], theme.pdfColors.title[1], theme.pdfColors.title[2]);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(theme.title.toUpperCase(), pdfWidth / 2, 45, { align: "center" });
      
      // Subtitle
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "italic");
      pdf.text("This is to certify that", pdfWidth / 2, 70, { align: "center" });
      
      // Name
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.setFontSize(40);
      pdf.setFont("helvetica", "bold");
      pdf.text(cert.userName, pdfWidth / 2, 95, { align: "center" });
      
      // Line
      pdf.setDrawColor(theme.pdfColors.border[0], theme.pdfColors.border[1], theme.pdfColors.border[2]);
      pdf.setLineWidth(0.5);
      pdf.line(pdfWidth / 2 - 50, 110, pdfWidth / 2 + 50, 110);
      
      // Body
      pdf.setTextColor(55, 65, 81); // gray-700
      pdf.setFontSize(theme.subtitle.length > 50 ? 12 : 16);
      pdf.setFont("helvetica", "normal");
      
      // Use splitTextToSize if subtitle is very long
      const splitSubtitle = pdf.splitTextToSize(theme.subtitle, pdfWidth - 40);
      pdf.text(splitSubtitle, pdfWidth / 2, 125, { align: "center" });

      // Module Name
      pdf.setTextColor(theme.pdfColors.title[0], theme.pdfColors.title[1], theme.pdfColors.title[2]);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(cert.moduleTitle, pdfWidth / 2, 145, { align: "center" });

      // Date and Score
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const dateStr = new Date(cert.date).toLocaleDateString();
      pdf.text(`Issued on ${dateStr}  |  Score: ${cert.score}%`, pdfWidth / 2, 185, { align: "center" });
      const displayId = cert.moduleId === "3" ? `ECO-ADV-${new Date(cert.date).getFullYear()}-${cert.id.split('-')[1].substring(0, 4)}` : cert.id;
      pdf.text(`Certificate ID: ${displayId}`, pdfWidth / 2, 192, { align: "center" });
      
      // Signatures
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "italic");
      
      // Signature 1
      pdf.text("M. Green", 60, 175, { align: "center" });
      pdf.setDrawColor(theme.pdfColors.border[0], theme.pdfColors.border[1], theme.pdfColors.border[2]);
      pdf.setLineWidth(0.5);
      pdf.line(40, 178, 80, 178);
      pdf.setTextColor(theme.pdfColors.title[0], theme.pdfColors.title[1], theme.pdfColors.title[2]);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("PROGRAM DIRECTOR", 60, 183, { align: "center" });

      // Signature 2
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "italic");
      pdf.text("E. Rostova", pdfWidth - 60, 175, { align: "center" });
      pdf.setDrawColor(theme.pdfColors.border[0], theme.pdfColors.border[1], theme.pdfColors.border[2]);
      pdf.setLineWidth(0.5);
      pdf.line(pdfWidth - 80, 178, pdfWidth - 40, 178);
      pdf.setTextColor(theme.pdfColors.title[0], theme.pdfColors.title[1], theme.pdfColors.title[2]);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("LEAD INSTRUCTOR", pdfWidth - 60, 183, { align: "center" });
      
      pdf.save(`EcoQuiz_Certificate_${moduleTitle.replace(/\s+/g, "_")}.pdf`);
      
      toast.success("PDF Downloaded Successfully!", { id: `pdf-${id}` });
    } catch (error) {
      console.error("PDF generating error:", error);
      toast.error("Failed to generate PDF.", { id: `pdf-${id}` });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400">Your earned credentials and achievements.</p>
        </div>

        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white dark:bg-gray-800 p-12 text-center mt-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400">
              <Award className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Certificates Yet</h3>
            <p className="mb-6 max-w-sm text-sm font-medium text-gray-500 dark:text-gray-400">
              Complete modules with a score of 75% or higher to earn official certificates.
            </p>
            <Link to="/modules" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700">
              <BookOpen className="h-4 w-4" /> Start Learning
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {certificates.map((cert, index) => {
              const theme = getCertificateTheme(cert.moduleId);
              return (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                className="flex flex-col gap-6 items-center"
              >
                <div className="w-full flex justify-center px-4 sm:px-0">
                  <div 
                    id={`certificate-${cert.id}`}
                    ref={(el) => (certRefs.current[cert.id] = el)}
                    className="relative w-full max-w-4xl aspect-[1.414] bg-[#faf9f6] p-4 shadow-2xl shadow-gray-200/50 flex flex-col justify-center items-center text-center overflow-hidden ring-1 ring-black/5"
                  >
                    {/* Paper Texture Overlay */}
                    <div className="texture-overlay absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}></div>
                    
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
                       <Award className="w-[500px] h-[500px]" strokeWidth={1} />
                    </div>

                    {/* True Double Border */}
                    <div className="absolute inset-[24px] sm:inset-[32px] border-[1px] pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] bg-white/40 mix-blend-overlay" />
                    <div className="absolute inset-[24px] sm:inset-[32px] border-[1px] pointer-events-none" style={{ borderColor: theme.borderColor }} />
                    <div className="absolute inset-[30px] sm:inset-[40px] border-[6px] border-double pointer-events-none" style={{ borderColor: theme.textAccentColor, opacity: 0.6 }} />

                    {/* Corner Ornaments */}
                    <div className="absolute top-[28px] left-[28px] sm:top-[38px] sm:left-[38px] w-6 h-6 border-t-[3px] border-l-[3px] pointer-events-none" style={{ borderColor: theme.textAccentColor }} />
                    <div className="absolute top-[28px] right-[28px] sm:top-[38px] sm:right-[38px] w-6 h-6 border-t-[3px] border-r-[3px] pointer-events-none" style={{ borderColor: theme.textAccentColor }} />
                    <div className="absolute bottom-[28px] left-[28px] sm:bottom-[38px] sm:left-[38px] w-6 h-6 border-b-[3px] border-l-[3px] pointer-events-none" style={{ borderColor: theme.textAccentColor }} />
                    <div className="absolute bottom-[28px] right-[28px] sm:bottom-[38px] sm:right-[38px] w-6 h-6 border-b-[3px] border-r-[3px] pointer-events-none" style={{ borderColor: theme.textAccentColor }} />

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto w-full pt-12 sm:pt-20">
                      
                      <h2 className="font-serif text-sm sm:text-base font-semibold uppercase mb-4 sm:mb-8" style={{ color: theme.textAccentColor, opacity: 0.9 }}>
                        {theme.title}
                      </h2>
                      
                      <p className="font-serif italic text-base sm:text-xl text-[#6b7280] mb-6 sm:mb-10">
                        This is to certify that
                      </p>
                      
                      <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#111827] leading-none px-8" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.05)" }}>
                        {cert.userName}
                      </h1>
                      
                      <div className="mt-8 mb-6 h-[1.5px] w-4/5 max-w-[500px]" style={{ background: `linear-gradient(to right, transparent, ${theme.borderColor}, transparent)` }} />
                      
                      <p className="font-serif text-[15px] sm:text-[20px] text-[#374151] leading-relaxed max-w-2xl px-8 mb-4 text-center">
                        {theme.subtitle}
                      </p>
                      <h3 className="font-serif font-bold text-2xl sm:text-4xl mb-12" style={{ color: theme.textAccentColor }}>
                        {cert.moduleTitle}
                      </h3>

                      {/* Signatures & Metadata Block */}
                      <div className="mt-auto w-full flex justify-between items-end px-12 sm:px-20 pb-16 relative">
                        
                        {/* Left Signature */}
                        <div className="flex w-32 flex-col items-center relative z-20">
                          <div className="w-full text-center pb-2">
                            <span className="font-serif italic text-2xl sm:text-4xl text-[#1f2937] opacity-90" style={{ fontFamily: "Brush Script MT, cursive" }}>M. Green</span>
                          </div>
                          <div className="w-full h-[1px] mb-3" style={{ background: theme.borderColor }} />
                          <span className="text-[9px] sm:text-[11px] font-sans uppercase font-semibold" style={{ color: theme.textAccentColor, opacity: 0.7 }}>Program Director</span>
                        </div>

                        {/* Right Signature */}
                        <div className="flex w-32 flex-col items-center relative z-20">
                          <div className="w-full text-center pb-2">
                            <span className="font-serif italic text-2xl sm:text-4xl text-[#1f2937] opacity-90" style={{ fontFamily: "Brush Script MT, cursive" }}>E. Rostova</span>
                          </div>
                          <div className="w-full h-[1px] mb-3" style={{ background: theme.borderColor }} />
                          <span className="text-[9px] sm:text-[11px] font-sans uppercase font-semibold" style={{ color: theme.textAccentColor, opacity: 0.7 }}>Lead Instructor</span>
                        </div>

                        {/* Seal (Bottom Center) */}
                        <div className="absolute left-1/2 bottom-12 -translate-x-1/2 flex justify-center items-center pointer-events-none">
                          <div className="absolute w-28 h-28 rounded-full blur-xl" style={{ background: theme.bgOverlay }} />
                          
                          <div className={`relative z-10 w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] bg-gradient-to-br ${theme.sealGradient} rounded-full flex flex-col items-center justify-center text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] border-[3px] border-[#fbbf24] ring-[6px] ${theme.ringColor} outline outline-[1px] outline-black/10 overflow-hidden transform group`}>
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,1)_100%),repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,1)_3px,rgba(255,255,255,1)_4px)]" />
                            {cert.moduleId === "3" ? (
                               <>
                                  <div className="absolute top-2 w-full text-center">
                                     <span className="text-[5px] sm:text-[6px] font-bold uppercase tracking-[1px] text-[#fde68a] opacity-80">Certified By</span>
                                  </div>
                                  <Award className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 text-[#fef3c7] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] mb-1 mt-1" strokeWidth={1.5} />
                                  <span className="relative z-10 text-[6px] sm:text-[8px] font-bold uppercase tracking-widest text-[#fde68a] drop-shadow-md">Authority</span>
                               </>
                            ) : (
                               <>
                                  <Award className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 text-[#fef3c7] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] mb-1" strokeWidth={1.5} />
                                  <span className="relative z-10 text-[7px] sm:text-[9px] font-bold uppercase text-[#fde68a] drop-shadow-md">Verified • {cert.score}%</span>
                               </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Verification Text */}
                      <div className="absolute bottom-[44px] sm:bottom-[54px] w-full text-center">
                         <p className="font-serif text-[9px] sm:text-[11px] text-[#6b7280] uppercase">
                           Issued on {new Date(cert.date).toLocaleDateString()} &nbsp;•&nbsp; ID: {cert.moduleId === "3" ? `ECO-ADV-${new Date(cert.date).getFullYear()}-${cert.id.split('-')[1].substring(0, 4)}` : cert.id}
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center w-full max-w-4xl px-4 sm:px-0 gap-3">
                   <button 
                     onClick={() => downloadImageAction(cert.id, cert.moduleTitle)}
                     disabled={downloadingImageId === cert.id || downloadingId === cert.id}
                     className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-700 hover:ring-gray-300 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {downloadingImageId === cert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                     ) : (
                        <ImageIcon className="h-4 w-4" />
                     )}
                     Image
                   </button>
                   <button 
                     onClick={() => setConfirmingId({ id: cert.id, title: cert.moduleTitle })}
                     disabled={downloadingId === cert.id || downloadingImageId === cert.id}
                     className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-700 hover:ring-gray-300 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {downloadingId === cert.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                     ) : (
                        <FileText className="h-4 w-4" />
                     )}
                     PDF
                   </button>
                   <button 
                     onClick={() => handleShareClick(cert.id, cert.moduleTitle)}
                     className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
                   >
                     <Share2 className="h-4 w-4" /> Share
                   </button>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {confirmingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500">
                      <Download className="h-6 w-6" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Download Certificate</h2>
                    </div>
                    <button onClick={() => setConfirmingId(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Are you sure you want to download your official certificate for <span className="font-semibold text-gray-900 dark:text-gray-100">"{confirmingId.title}"</span>?
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => setConfirmingId(null)}
                      className="rounded-xl px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        executeDownload(confirmingId.id, confirmingId.title);
                        setConfirmingId(null);
                      }}
                      className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                    >
                      Confirm Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {shareModalData && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) setShareModalData(null); }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Share your achievement</h2>
                    <button onClick={() => setShareModalData(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {/* WhatsApp */}
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`I just earned my Environmental Certification in ${shareModalData.title} 🌱\nCheck it out here: ${window.location.origin}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                        <MessageCircle className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">WhatsApp</span>
                    </a>
                    
                    {/* LinkedIn */}
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
                        <Linkedin className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                    </a>

                    {/* Twitter */}
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just earned my Environmental Certification in ${shareModalData.title} 🌱\nCheck it out here: ${window.location.origin}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                        <Twitter className="w-7 h-7 fill-current" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">X (Twitter)</span>
                    </a>

                    {/* Telegram */}
                    <a 
                      href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`I just earned my Environmental Certification in ${shareModalData.title} 🌱`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
                        <Send className="w-7 h-7 ml-1 mb-1" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Telegram</span>
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}`);
                        toast.success("Link copied!");
                        setShareModalData(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" /> Copy Link
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
