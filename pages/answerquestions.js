import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function AnswerQuestions() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [generating, setGenerating] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false);
  const [cooldown, setCooldown] = useState(0);


  const router = useRouter();
  const generateWorkoutRef = useRef(null);

  
    useEffect(() => {
      if (router.pathname === "/answerquestions") {
        document.body.style.overflowY = "scroll";
      } else {
        document.body.style.overflowY = "hidden";
      }
  
      return () => {
        document.body.style.overflowY = "hidden";
      };
    }, [router.pathname]);
  

  const questions = [
    { id: 1, question: "Gender?", options: ["Male", "Female"] },
    { id: 2, question: "How would you describe your current fitness level?", options: ["Beginner", "Intermediate", "Advanced"] },
    { id: 3, question: "What type of workouts do you prefer?", options: ["Cardio", "Strength training", "Yoga", "HIIT", "Pilates"] },
    { id: 4, question: "Weight?", type: "input", placeholder: "Pound" },
    { id: 5, question: "Height", type: "input", placeholder: "Feet" },
    { id: 6, question: "Age?", type: "input" },
  ];

  const handleOptionChange = (questionId, option) => {
    setResponses((prevResponses) => {
      if (questionId === 3) {
        const prevOptions = prevResponses[questionId] || [];
        const updatedOptions = prevOptions.includes(option)
          ? prevOptions.filter((o) => o !== option)
          : [...prevOptions, option]; 
        return {
          ...prevResponses,
          [questionId]: updatedOptions,
        };
      } else {
        return {
          ...prevResponses,
          [questionId]: option,
        };
      }
    });
  };
  

  const handleInputChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleGenerateWorkout = async () => {
    setGenerating(true);
    setError(null);
    setCooldown(15);
  
    try {
      const res = await fetch("/api/GeminiAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }), // Send the responses object
      });
  
      if (!res.ok) {
        throw new Error("Failed to generate workout");
      }
  
      const data = await res.json();
      console.log("Generated workout:", data.response);
      // Optionally set this response in state to display in your UI
      setResponse(data.response);
    } catch (err) {
      console.error("Error generating workout:", err.message);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };
  
  const allQuestionsAnswered = questions.every((q) => {
    const answer = responses[q.id];
    if (q.type === "input") {
      return answer && answer.trim() !== ""; // Ensure input is not empty
    }
    if (Array.isArray(answer)) {
      return answer.length > 0; // Ensure multiple-choice has at least one selection
    }
    return Boolean(answer); // For single-choice questions
  });

    useEffect(() => {

      const timeoutId = setTimeout(() => {
        if (allQuestionsAnswered && !isScrolled) {
          setIsScrolled(true);
          generateWorkoutRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 700)

      return () => clearTimeout(timeoutId);
    }, [responses, isScrolled]);

    useEffect(() => {
      if (cooldown > 0) {
        const timerId = setInterval(() => {
          setCooldown((prev) => prev - 1);
        }, 1000);
  
        return () => clearInterval(timerId);
      }
    }, [cooldown]);
  

  return (
    <div 
     style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
    <div className="questions-container">
      {questions.map((q) => (
        <div key={q.id} className="question">
          <h3>{q.question}</h3>
          <div className="options-container">
            {q.type === "input" ? (
              <input
              type="number"
              value={responses[q.id] || ""}
              onChange={(e) => !generating && handleInputChange(q.id, e.target.value)} 
              className={`typed-input ${generating ? "disabled" : ""}`} 
              placeholder={q.placeholder}
              disabled={generating}
            />
            ) : (
              q.options.map((option) => (
                <label
                key={option}
                className={`option ${
                  Array.isArray(responses[q.id]) && responses[q.id].includes(option)
                    ? "selected"
                    : responses[q.id] === option
                    ? "selected"
                    : ""
                } ${generating ? "disabled" : ""}`} // Add a "disabled" class for styling
                onClick={() => !generating && handleOptionChange(q.id, option)} // Prevent interaction when generating
              >
                {option}
                <input
                  type={q.id === 3 ? "checkbox" : "radio"}
                  name={`question-${q.id}`}
                  value={option}
                  checked={
                    Array.isArray(responses[q.id])
                      ? responses[q.id].includes(option)
                      : responses[q.id] === option
                  }
                  onChange={() => !generating && handleOptionChange(q.id, option)} // Prevent interaction when generating
                  className="hidden-radio"
                  disabled={generating} // Disable the input field directly
                />
                <div className="circle">
                  {(Array.isArray(responses[q.id]) && responses[q.id].includes(option)) ||
                  responses[q.id] === option ? (
                    <div className="checkmark">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="white"
                      >
                        <path d="M20.285 6.318l-11.054 11.41-5.516-5.7 1.447-1.403 4.034 4.164 9.606-9.927z" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              </label>
              ))
            )}
          </div>
        </div>
      ))}
          <div 
          style={{ display: 'flex', justifyContent: 'center', height: '20vh' }} 
          className="generate-workout-container"
          ref={generateWorkoutRef}
          >
          <button 
            style={{ 
                    pointerEvents: allQuestionsAnswered && cooldown === 0 && !generating ? "auto" : "none",
                    opacity: allQuestionsAnswered && cooldown === 0 && !generating ? 1 : 0.6,
                  }} 
            onClick={handleGenerateWorkout} 
            className="generate-workout"
            disabled={!(questions.every((q) => responses[q.id]) && !generating)} // Add disabled attribute
          >
          {generating ? "Generating..." : cooldown > 0 ? cooldown : "Generate Workout"}
          </button>
          </div>
          </div>
          {response && (
          <div style={{ color: 'white', display: 'flex', justifyContent: 'center' }}>
            <p>Your Generated Workout Plan: {response}</p>
          </div>
          )}
        </div>
  );
}
