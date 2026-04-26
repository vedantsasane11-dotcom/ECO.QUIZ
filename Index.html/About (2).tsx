import { Leaf, Target, Settings, BookOpen, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";

export function About() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">About EcoQuiz</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Discover our platform and our commitment to environmental education.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: About EcoQuiz */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 shadow-lg text-white"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Leaf className="w-6 h-6 text-emerald-100" />
              </div>
              <h2 className="text-2xl font-bold">About EcoQuiz</h2>
            </div>
            <p className="text-emerald-50 text-lg leading-relaxed max-w-3xl">
              EcoQuiz is an interactive platform designed to make environmental learning simple, engaging, and rewarding through quizzes and certifications.
            </p>
          </motion.div>

          {/* Section 2: Our Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              To promote environmental awareness and empower individuals with knowledge about sustainability, climate change, and responsible living.
            </p>
          </motion.div>

          {/* Section 3: How It Works */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How It Works</h2>
            </div>
            <ol className="space-y-3">
              {[
                "Choose a module",
                "Complete 25-question quiz",
                "Score 75% or more",
                "Earn your certificate"
              ].map((step, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Section 4: What You'll Learn */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What You'll Learn</h2>
            </div>
            <ul className="grid grid-cols-1 gap-2">
              {[
                "Climate change basics",
                "Sustainable living practices",
                "Renewable energy concepts",
                "Environmental challenges"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 5: Certification */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-2.5 rounded-lg text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certification</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Earn professional certificates by completing modules successfully. Each certificate reflects your knowledge level and can be shared as proof of achievement.
            </p>
          </motion.div>

          {/* Section 6: Key Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-2.5 rounded-lg text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Features</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Interactive quizzes",
                "AI-powered explanations",
                "Progress tracking",
                "Downloadable certificates"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-1 rounded">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </PageTransition>
  );
}
