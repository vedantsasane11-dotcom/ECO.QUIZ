import { BookOpen, Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

import { MODULES } from "../data/modules";

export function Modules() {
  const { modulesCompleted, quizProgress } = useAppStore();

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Modules</h1>
            <p className="text-gray-500 dark:text-gray-400">Browse available courses and start learning.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {MODULES.map((mod, index) => {
            const isCompleted = modulesCompleted > index;
            const currentQuizData = quizProgress[mod.id];
            const answeredQuestions = currentQuizData ? currentQuizData.userAnswers.filter(Boolean).length : 0;
            const progressPercentage = Math.round((answeredQuestions / mod.questions) * 100);

            return (
            <div key={mod.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm shadow-gray-200/40 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-1">
              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100/50">
                    {mod.tag}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-gray-300" /> {mod.questions} questions</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gray-300" /> {mod.time}</span>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-emerald-800">{mod.title}</h3>
                <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{mod.description}</p>
                
                {isCompleted && (
                   <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Completed
                   </div>
                )}
                
                {!isCompleted && answeredQuestions > 0 && (
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-emerald-600">
                       <span>In Progress</span>
                       <span>{progressPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <Link
                  to={`/quiz/${mod.id}`}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-gray-900/20 transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                   {isCompleted ? "Review Module" : answeredQuestions > 0 ? "Resume Module" : "Start Module"} <PlayCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
