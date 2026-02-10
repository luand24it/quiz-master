import { GoogleGenAI } from "@google/genai";
import { QuizData } from "../types";

// Initialize the API client
// Note: In a real environment, set API_KEY in your .env file or environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizFromTopic = async (topic: string): Promise<QuizData> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
  Bạn là một công cụ tạo bài kiểm tra trắc nghiệm chuyên nghiệp. 
  Nhiệm vụ của bạn: 
  1. Dựa trên chủ đề "${topic}", tạo đúng 10 câu hỏi trắc nghiệm tiếng Việt. 
  2. Mỗi câu hỏi phải có: nội dung câu hỏi, 4 phương án (A, B, C, D), đáp án đúng và lời giải thích chi tiết.
  3. Phương án trong mảng options không cần bao gồm tiền tố "A.", "B."... chỉ cần nội dung.
  4. Luôn trả về kết quả dưới dạng JSON thuần túy để lập trình có thể đọc được.
  5. Cấu trúc JSON bắt buộc:
  {
    "quiz_title": "Tên chủ đề ngắn gọn",
    "questions": [
      {
        "id": 1,
        "question": "Nội dung câu hỏi?",
        "options": ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"],
        "answer": "Nội dung chính xác của đáp án đúng (phải khớp với một trong các options)",
        "explanation": "Giải thích tại sao đúng"
      }
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Không nhận được dữ liệu từ Gemini.");
    }

    // Parse the JSON response
    const quizData: QuizData = JSON.parse(text);
    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Đã có lỗi xảy ra khi tạo bài trắc nghiệm. Vui lòng thử lại.");
  }
};
