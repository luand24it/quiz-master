export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizData {
  quiz_title: string;
  questions: Question[];
}

export interface QuizState {
  data: QuizData | null;
  loading: boolean;
  error: string | null;
  userAnswers: Record<number, string>; // Maps question ID to selected answer string
  isSubmitted: boolean;
  score: number;
}
