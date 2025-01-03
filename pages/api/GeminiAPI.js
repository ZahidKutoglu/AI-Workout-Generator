const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({ error: "Responses are required" });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


      const prompt = `
        Generate a workout plan based on the following information:
        Gender: ${responses[1]}
        Fitness Level: ${responses[2]}
        Preferred Workouts: ${responses[3]?.join(", ")}
        Weight: ${responses[4]} pounds
        Height: ${responses[5]} feet
        Age: ${responses[6]} years old.
      `;


      const result = await model.generateContent(prompt);
      res.status(200).json({ response: result.response.text() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

