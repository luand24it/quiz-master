import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer: string | undefined;
  onSelect: (questionId: number, answer: string) => void;
  isSubmitted: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedAnswer,
  onSelect,
  isSubmitted,
}) => {
  const isCorrect = selectedAnswer === question.answer;
  const hasAnswered = !!selectedAnswer;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 transition-all hover:shadow-md">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
          {index + 1}
        </span>
        <h3 className="text-lg font-medium text-slate-800 leading-tight pt-1">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 pl-11">
        {question.options.map((option, idx) => {
          let optionClass = "w-full text-left p-3 rounded-lg border transition-all duration-200 relative ";
          
          if (isSubmitted) {
            if (option === question.answer) {
              // Correct answer style
              optionClass += "bg-green-50 border-green-500 text-green-700 font-medium";
            } else if (option === selectedAnswer) {
              // User selected wrong answer
              optionClass += "bg-red-50 border-red-500 text-red-700";
            } else {
              // Unselected options
              optionClass += "bg-slate-50 border-slate-200 text-slate-500 opacity-60";
            }
          } else {
            // Interactive state
            if (option === selectedAnswer) {
              optionClass += "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500";
            } else {
              optionClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-700";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !isSubmitted && onSelect(question.id, option)}
              disabled={isSubmitted}
              className={optionClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && option === question.answer && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                )}
                {isSubmitted && option === selectedAnswer && option !== question.answer && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className={`mt-4 ml-11 p-4 rounded-lg text-sm border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className="font-semibold mb-1">
            {isCorrect ? 'Chính xác!' : 'Chưa chính xác.'}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
