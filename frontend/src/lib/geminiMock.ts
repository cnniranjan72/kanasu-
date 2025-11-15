// frontend/src/lib/geminiMock.ts

export const mockGeminiReply = async (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `🤖 Mock Gemini Response:\nYou said: "${userMessage}"\n\n(This is a demo reply.)`
      );
    }, 700);
  });
};
