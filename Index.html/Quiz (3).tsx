import { useState, useMemo } from "react";
import { X, CheckCircle, AlertCircle, Award, RefreshCw, ChevronLeft, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";
import { toast } from "sonner";
import { QUIZ_DATA } from "../data/quizData";

function QuizResult({ score, total, percentage, passed, userAnswers, questions }: any) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const navigate = useNavigate();

  const filteredQuestions = questions.map((q: any, i: number) => ({ ...q, index: i })).filter((q: any) => {
    if (filter === 'all') return true;
    const isCorrect = userAnswers[q.index] === q.correct;
    return filter === 'correct' ? isCorrect : !isCorrect;
  });

  return (
    <div className="flex h-screen flex-col bg-[#fdfcfa] dark:bg-gray-900 overflow-hidden">
      <header className="flex h-20 flex-shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-sm z-10">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Quiz Results</h1>
        <button onClick={() => navigate('/')} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300">
           <X className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8 pb-10">
          
          {/* Summary Card */}
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 p-8 pt-10 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="h-48 w-48 -mr-12 -mt-12 text-green-900" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              {/* Left: Score Circle */}
              <div className="flex flex-col items-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border-8 border-gray-100 dark:border-gray-800">
                  <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
                    <circle cx="50%" cy="50%" r="46%" className="fill-transparent stroke-gray-200 stroke-[8%]" />
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r="46%" 
                      className={cn("fill-transparent stroke-[8%] transition-all duration-1000", passed ? "stroke-green-500" : "stroke-amber-500")}
                      style={{ strokeDasharray: "289", strokeDashoffset: `${289 - (289 * percentage) / 100}` }} 
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-4xl font-black text-gray-900 dark:text-gray-100">{percentage}%</span>
                  </div>
                </div>
                <div className={cn("mt-6 px-4 py-1.5 rounded-full text-sm font-bold", passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                  {passed ? 'Passed!' : 'Needs Improvement'}
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex-1 w-full text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Performance Summary</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{total}</p>
                  </div>
                  <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 p-4 border-l-4 border-l-green-500">
                    <p className="text-[13px] font-bold tracking-wide uppercase text-green-700/70 dark:text-green-400/80">Correct</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{score}</p>
                  </div>
                  <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-4 border-l-4 border-l-red-500">
                    <p className="text-[13px] font-bold tracking-wide uppercase text-red-700/70 dark:text-red-400/80">Wrong</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">{total - score}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    {passed ? (
                       <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                         <Award className="h-5 w-5" /> You are eligible for certificate 🎉
                       </p>
                    ) : (
                       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                         Score 75% to unlock certificate
                       </p>
                    )}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => window.location.reload()} className="flex-1 sm:flex-none flex justify-center items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:bg-gray-900 hover:-translate-y-0.5">
                       <RefreshCw className="h-4 w-4" /> Retake
                    </button>
                    {passed && (
                      <button onClick={() => navigate('/certificates')} className="flex-1 sm:flex-none flex justify-center items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-500/30 transition-all hover:bg-green-700 hover:-translate-y-0.5">
                         View Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Answer Review */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Full Answer Review</h3>
              
              <div className="flex gap-2">
                 <button onClick={() => setFilter('all')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", filter === 'all' ? "bg-gray-900 text-white shadow-md shadow-gray-900/20" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-900")}>
                    All
                 </button>
                 <button onClick={() => setFilter('correct')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", filter === 'correct' ? "bg-green-100 text-green-800 border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-900")}>
                    Correct ({score})
                 </button>
                 <button onClick={() => setFilter('incorrect')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", filter === 'incorrect' ? "bg-red-100 text-red-800 border-transparent" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-900")}>
                    Incorrect ({total - score})
                 </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q: any) => {
                const isCorrect = userAnswers[q.index] === q.correct;
                const userAnswerText = q.options.find((o: any) => o.id === userAnswers[q.index])?.text || "Not answered";
                const correctAnswerText = q.options.find((o: any) => o.id === q.correct)?.text || "";

                return (
                  <div key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:shadow-gray-200/50">
                     <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm", isCorrect ? "bg-green-500 shadow-sm shadow-green-500/30" : "bg-red-500 shadow-sm shadow-red-500/30")}>
                           {q.index + 1}
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 leading-relaxed pt-1.5">{q.text}</p>
                        </div>
                     </div>
                     
                     <div className="ml-11 sm:ml-12 grid gap-3 mb-5">
                       {/* User Answer */}
                       <div className={cn("rounded-xl p-3 sm:p-4 border flex items-start gap-3", isCorrect ? "border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20" : "border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20")}>
                         <div className="mt-0.5">
                           {isCorrect ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500" />}
                         </div>
                         <div>
                            <p className={cn("text-[11px] sm:text-xs font-bold uppercase mb-0.5 tracking-wider", isCorrect ? "text-green-700/70 dark:text-green-400/80" : "text-red-700/70 dark:text-red-400/80")}>Your Answer</p>
                            <p className={cn("text-sm font-semibold", isCorrect ? "text-green-900 dark:text-green-300" : "text-red-900 dark:text-red-300")}>{userAnswerText}</p>
                         </div>
                       </div>
                       
                       {/* Correct Answer (if user got it wrong) */}
                       {!isCorrect && (
                         <div className="rounded-xl p-3 sm:p-4 border border-green-200/60 dark:border-green-800/30 bg-green-50/30 dark:bg-green-900/10 flex items-start gap-3">
                           <div className="mt-0.5">
                             <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-500" />
                           </div>
                           <div>
                              <p className="text-[11px] sm:text-xs font-bold uppercase mb-0.5 tracking-wider text-green-700/70 dark:text-green-400/80">Correct Answer</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{correctAnswerText}</p>
                           </div>
                         </div>
                       )}
                     </div>

                     {/* Explanation */}
                     <div className="ml-11 sm:ml-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                          <span className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm mr-2 inline-block">Explanation</span> 
                          <span className="mt-2 block sm:inline sm:mt-0">{q.explanation}</span>
                        </p>
                     </div>
                  </div>
                )
              })}
              
              {filteredQuestions.length === 0 && (
                <div className="py-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                   <p className="text-gray-500 dark:text-gray-400 font-medium">No questions fit this filter.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userName, addCertificate, incrementModulesCompleted, addScore, addActivity, quizProgress, updateQuizProgress, clearQuizProgress } = useAppStore();
  
  const savedProgress = id && quizProgress[id] ? quizProgress[id] : null;

  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex || 0);
  const [selectedOption, setSelectedOption] = useState<string | null>(savedProgress?.userAnswers[savedProgress?.currentIndex || 0] || null);
  const [userAnswers, setUserAnswers] = useState<string[]>(savedProgress?.userAnswers || []);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = useMemo(() => QUIZ_DATA[id || "1"] || QUIZ_DATA["1"], [id]);
  
  const question = quizQuestions[currentIndex];
  const progress = quizFinished ? 100 : ((currentIndex) / quizQuestions.length) * 100;

  const handleNext = () => {
    if (!selectedOption) return;
    
    const nextAnswers = [...userAnswers];
    nextAnswers[currentIndex] = selectedOption;
    setUserAnswers(nextAnswers);

    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(c => c + 1);
      if (id) updateQuizProgress(id, currentIndex + 1, nextAnswers);
      setSelectedOption(nextAnswers[currentIndex + 1] || null);
    } else {
      if (id) clearQuizProgress(id);
      handleFinishQuiz(nextAnswers);
    }
  };

  const handleFinishQuiz = (finalAnswers: string[]) => {
    setQuizFinished(true);
    let finalScore = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === quizQuestions[idx].correct) {
        finalScore++;
      }
    });
    setScore(finalScore);

    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    let moduleName = "Environmental Basics";
    if (id === "2") moduleName = "Sustainability & Climate Action";
    else if (id === "3") moduleName = "Advanced Environmental Challenges";

    addActivity({
      title: 'Completed Quiz',
      description: `${moduleName} - Scored ${percentage}%`,
      type: 'quiz_completed'
    });

    if (percentage >= 75) {
      // Only increment if they haven't earned this certificate before
      const hasCertificate = useAppStore.getState().certificates.some(c => c.moduleId === (id || "1"));
      
      if (!hasCertificate) {
        incrementModulesCompleted();
        addScore(percentage);
      }

      addCertificate({
        moduleId: id || "1",
        moduleTitle: moduleName,
        score: percentage,
        userName
      });
      addActivity({
        title: 'Earned Certificate',
        description: moduleName,
        type: 'certificate_earned'
      });
      toast.success("🎉 Congratulations! Your certificate has been generated.");
    }
  };

  if (quizFinished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 75;
    
    return (
      <QuizResult 
        score={score} 
        total={quizQuestions.length} 
        percentage={percentage} 
        passed={passed} 
        userAnswers={userAnswers}
        questions={quizQuestions}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB] dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-green-100/40 dark:from-green-900/20 to-transparent pointer-events-none" />
      
      <header className="flex h-20 flex-shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 backdrop-blur-md relative z-10">
        <button onClick={() => {
          if (id && selectedOption) {
            const nextAnswers = [...userAnswers];
            nextAnswers[currentIndex] = selectedOption;
            updateQuizProgress(id, currentIndex, nextAnswers);
          }
          navigate(-1);
        }} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300">
           <X className="h-6 w-6" />
        </button>
        <div className="mx-6 relative h-3 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 max-w-2xl">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="text-sm font-bold text-gray-400 w-12 text-right">{currentIndex + 1} / {quizQuestions.length}</div>
      </header>

      <main className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 sm:py-16 relative z-10 w-full">
        <div className="w-full max-w-2xl px-4">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.4 }}
               className="w-full"
             >
               <div className="flex items-start sm:items-center justify-center gap-3 mb-10">
                 <Leaf className="w-7 h-7 text-green-600 shrink-0 mt-1 sm:mt-0" />
                 <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-3xl text-balance text-center">
                   {question.text}
                 </h2>
               </div>

               <div className="flex flex-col gap-4">
                 {question.options.map((opt) => {
                   const isSelected = selectedOption === opt.id;
                   
                   return (
                     <motion.button 
                       whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
                       whileTap={{ scale: 0.98 }}
                       animate={{ scale: isSelected ? 1.02 : 1 }}
                       key={opt.id}
                       onClick={() => setSelectedOption(opt.id)}
                       className={cn(
                         "group flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300 shadow-sm", 
                         isSelected 
                           ? "border-green-600 dark:border-green-500 bg-green-100 dark:bg-green-900/30 shadow-md ring-1 ring-green-600 dark:ring-green-500"
                           : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                       )}
                     >
                       <span className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors", 
                         isSelected 
                           ? "border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 bg-white dark:bg-gray-800" 
                           : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 group-hover:border-green-400 dark:group-hover:border-green-600 group-hover:text-green-600 dark:group-hover:text-green-500 bg-white dark:bg-gray-800"
                       )}>
                         {opt.id}
                       </span>
                       <span className="text-[15px] font-medium leading-relaxed text-gray-900 dark:text-gray-100">{opt.text}</span>
                     </motion.button>
                   );
                 })}
               </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
      
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 backdrop-blur-md py-4 px-6 relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="mx-auto flex max-w-4xl items-center justify-end">
            <button 
              onClick={handleNext}
              disabled={!selectedOption}
              className={cn(
                "rounded-2xl px-10 py-3.5 font-bold tracking-wide transition-all duration-300",
                !selectedOption 
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed" 
                  : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/30 hover:-translate-y-0.5"
              )}
            >
              {currentIndex < quizQuestions.length - 1 ? "Next Question" : "Submit Quiz"}
            </button>
         </div>
      </div>
    </div>
  );
}
