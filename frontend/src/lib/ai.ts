export async function getGeminiReply(userText: string): Promise<string> {
  // 🔥 REAL GEMINI API CALL WHEN YOU'RE READY
  // const apiKey = import.meta.env.VITE_GEMINI_KEY;
  // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     contents: [{ parts: [{ text: userText }] }],
  //   }),
  // });
  // const data = await response.json();
  // return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure.";

  // ⭐ MOCK AI RESPONSE FOR NOW
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a mock AI response from Kanasu Chatbot!");
    }, 700);
  });
}
