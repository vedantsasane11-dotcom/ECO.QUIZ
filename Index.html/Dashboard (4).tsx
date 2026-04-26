import { BookOpen, Target, Award, ArrowRight, CheckCircle2, ChevronRight, Play, Leaf } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useMemo } from "react";

import { MODULES } from "../data/modules";

export function Dashboard() {
  const { userName, modulesCompleted, totalScore, certificates, activities, quizProgress } = useAppStore();

  const averageScore = modulesCompleted > 0 ? Math.round(totalScore / modulesCompleted) : 0;

  const nextModuleIndex = modulesCompleted < MODULES.length ? modulesCompleted : 0;
  const isAllCompleted = modulesCompleted >= MODULES.length;
  const nextModule = MODULES[nextModuleIndex];

  const currentQuizData = quizProgress[nextModule.id];
  const answeredQuestions = currentQuizData ? currentQuizData.userAnswers.filter(Boolean).length : 0;

  const progressPercentage = isAllCompleted ? 100 : Math.round((answeredQuestions / nextModule.questions) * 100);

  const STATS = useMemo(() => [
    { label: "Modules Completed", value: modulesCompleted.toString(), icon: BookOpen, subtext: isAllCompleted ? "All modules done!" : "Keep going!", color: "text-emerald-600", bg: "bg-emerald-50", border: "group-hover:border-emerald-200" },
    { label: "Average Score", value: `${averageScore}%`, icon: Target, subtext: "Based on completed quizzes", color: "text-blue-600", bg: "bg-blue-50", border: "group-hover:border-blue-200" },
    { label: "Certificates Earned", value: certificates.length.toString(), icon: Award, subtext: "From completed modules", color: "text-amber-600", bg: "bg-amber-50", border: "group-hover:border-amber-200" },
  ], [modulesCompleted, averageScore, certificates.length, isAllCompleted]);

  return (
    <PageTransition>
      <div className="space-y-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {Object.keys(quizProgress).length === 0 && certificates.length === 0 
                ? "Welcome to EcoQuiz! 🌱" 
                : `Welcome back, ${userName.split(' ')[0]}! 👋`}
            </h1>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 font-medium">
              {Object.keys(quizProgress).length === 0 && certificates.length === 0
                ? "Start your journey by taking your first quiz and earning your first certificate."
                : "You're making great progress. Continue your learning journey."}
            </p>
          </div>
          <Link to="/modules" className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0">
            {isAllCompleted ? "Review Modules" : Object.keys(quizProgress).length === 0 && certificates.length === 0 ? "Start Learning" : "Resume Learning"} <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className={`group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm shadow-gray-200/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${stat.border}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide">{stat.label}</p>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-1.5">
                <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">{stat.value}</h2>
                <p className="text-sm font-medium text-gray-400">{stat.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-1">{isAllCompleted ? "Revisit Module" : "Continue Learning"}</h3>
            
            <div className="group relative flex flex-col gap-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm shadow-gray-200/40 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-gray-200/50 cursor-pointer overflow-hidden">
               <div className="absolute right-0 top-0 h-full w-1 bg-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
               <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0 shadow-inner">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 transition-colors">{nextModule.title}</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Module {nextModule.id}: {nextModule.tag}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 shadow-sm">{progressPercentage}%</span>
                </div>
              </div>
              
              <div className="mt-3 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-gray-400">
                   <span>Status</span>
                   <span>{isAllCompleted ? `Completed (${nextModule.questions} Questions)` : answeredQuestions > 0 ? `In Progress (${answeredQuestions} / ${nextModule.questions} Questions)` : `Not Started (${nextModule.questions} Questions)`}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-black/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out shadow-sm shadow-emerald-500/50" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link to={`/quiz/${nextModule.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700 group/btn">
                  <span className="group-hover/btn:underline">{isAllCompleted ? "Review Module" : "Start Module"}</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 transition-colors group-hover/btn:bg-emerald-100">
                     <Play className="h-3 w-3 fill-emerald-600 ml-0.5" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Your Modules List */}
            <div className="mt-8 space-y-4 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-1">All Learning Modules</h3>
              <div className="flex flex-col gap-3">
                {MODULES.map((module) => {
                   const isCompleted = certificates.some(c => c.moduleId === module.id);
                   const isAdvanced = module.id === "3";
                   return (
                     <Link to={`/quiz/${module.id}`} key={module.id} className="group relative flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
                       <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gray-200 to-gray-300 transition-colors group-hover:from-emerald-400 group-hover:to-emerald-500" />
                       <div className="flex items-center gap-4 pl-3">
                         <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isAdvanced ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-600'} transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600`}>
                           <BookOpen className="h-5 w-5" />
                         </div>
                         <div className="flex flex-col">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 transition-colors">{module.title}</span>
                             {isAdvanced && (
                                <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">Advanced Level</span>
                             )}
                           </div>
                           <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{module.questions} Questions • {module.tag}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         {isCompleted && (
                           <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                             <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                           </span>
                         )}
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 transition-colors group-hover:bg-emerald-50">
                           <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                         </div>
                       </div>
                     </Link>
                   );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-1">Quick Actions & Activity</h3>
            
            <div className="flex flex-col gap-4">
              <Link to="/modules" className="group flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm shadow-gray-200/40 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-gray-900 dark:text-gray-100">Browse Modules</span>
                     <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Discover new topics</span>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 transition-colors group-hover:bg-emerald-50">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                </div>
              </Link>
              
              <Link to="/certificates" className="group flex items-center justify-between rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm shadow-gray-200/40 transition-all duration-300 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-gray-900 dark:text-gray-100">View Certificates</span>
                     <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Share your achievements</span>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 transition-colors group-hover:bg-amber-50">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600" />
                </div>
              </Link>
            </div>
            
            <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm shadow-gray-200/40">
               <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-wide uppercase text-gray-500 dark:text-gray-400">Recent Activity</h4>
               {activities.length === 0 ? (
                 <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">No recent activity. Start learning!</p>
               ) : (
                 <div className="space-y-6">
                   {activities.map((activity, index) => (
                     <Link 
                       to={activity.type === 'certificate_earned' ? '/certificates' : '/modules'}
                       key={activity.id} 
                       className="relative flex gap-4 group cursor-pointer"
                     >
                       {index !== activities.length - 1 && (
                         <div className="absolute left-4 top-10 -ml-px h-full w-[2px] bg-gray-100 dark:bg-gray-800" />
                       )}
                       <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-white shadow-sm transition-transform group-hover:scale-110 ${
                         activity.type === 'certificate_earned' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                       }`}>
                         {activity.type === 'certificate_earned' ? <Award className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                       </div>
                       <div className="flex-1 pb-1 group-hover:opacity-80 transition-opacity">
                         <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 transition-colors">{activity.title}</p>
                         <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{activity.description}</p>
                         <span className="mt-1 block text-[10px] font-semibold text-gray-400">
                           {new Date(activity.date).toLocaleDateString()}
                         </span>
                       </div>
                     </Link>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
