import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useRouter } from "next/router";



export default function Home() {
  
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [router.pathname]);

  const routeToAnswerQuestions = () => {
    router.push("/answerquestions")
  }

  const text = "Get Your Workout Plan Generated in few minutes with AI";
  const words = text.split(" ");

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 1.2, },
    },
  };


  return(
    <div> 

      <div className="personalTrainerContainer">
      <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="personalTrainer" src="personalTrainer.png"/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
      className="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.32 }}
      >
       Welcome to <span>FitTrack AI</span>
      </motion.div>

      <motion.div
        className="getYour"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={textVariants}
            style={{ display: 'inline-block', marginRight: '5px' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.32, delay: 2 }} 
      style={{ marginTop: 303 }} 
      className="flex items-center justify-center h-screen">
      <div className="relative group">
        <button
          className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
          onClick={routeToAnswerQuestions}
        >
          <span
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ></span>

          <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
            <div className="relative z-10 flex items-center space-x-2">
              <span className="transition-all duration-500 group-hover:translate-x-1">
                Let's get started
              </span>
              <svg
                className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                data-slot="icon"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </span>
        </button>
      </div>
      </motion.div>

      </div>

    </div>
  );
}
