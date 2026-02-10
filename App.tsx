import React, { useState } from 'react';
import { generateQuizFromTopic } from './services/geminiService';
import { QuizState } from './types';
import { QuestionCard } from './components/QuestionCard';
import { LoadingSpinner } from './components/LoadingSpinner';

const TOPIC_POOL = [
  "Thiên văn học", "Lịch sử Việt Nam", "Công nghệ AI", "Địa lý thế giới", "Văn học hiện đại",
  "Sinh học đại cương", "Hóa học hữu cơ", "Vật lý lượng tử", "Kinh tế vĩ mô", "Triết học",
  "Lập trình Web", "Ẩm thực Việt Nam", "Du lịch Châu Á", "Bóng đá thế giới", "Âm nhạc cổ điển",
  "Tiếng Anh thương mại", "Marketing Digital", "Tâm lý học hành vi", "Điện ảnh thế giới", "Thần thoại Hy Lạp"
];

const getRandomSuggestions = () => {
  const shuffled = [...TOPIC_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

function App() {
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState(() => getRandomSuggestions());
  const [quizState, setQuizState] = useState<QuizState>({
    data: null,
    loading: false,
    error: null,
    userAnswers: {},
    isSubmitted: false,
    score: 0,
  });

  const handleGenerateQuiz = async (selectedTopic: string) => {
    if (!selectedTopic.trim()) return;

    setTopic(selectedTopic);
    setQuizState({
      data: null,
      loading: true,
      error: null,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
    });

    try {
      const data = await generateQuizFromTopic(selectedTopic);
      setQuizState(prev => ({ ...prev, loading: false, data }));
    } catch (error) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Có lỗi xảy ra."
      }));
    }
  };

  const handleRefreshSuggestions = () => {
    setSuggestions(getRandomSuggestions());
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: answer }
    }));
  };

  const handleSubmit = () => {
    if (!quizState.data) return;

    let score = 0;
    quizState.data.questions.forEach(q => {
      if (quizState.userAnswers[q.id] === q.answer) {
        score++;
      }
    });

    setQuizState(prev => ({
      ...prev,
      isSubmitted: true,
      score
    }));
    
    // Smooth scroll to top to see score
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuiz = () => {
    setTopic('');
    setQuizState({
      data: null,
      loading: false,
      error: null,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetQuiz}>
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
               Q
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
               Quiz Master
             </h1>
          </div>
          {quizState.data && (
             <button onClick={resetQuiz} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
               Tạo đề mới
             </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* Input Section - Only show if no quiz data and not loading */}
        {!quizState.data && !quizState.loading && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bạn muốn kiểm tra kiến thức về gì?</h2>
            <p className="text-slate-500 mb-6">Nhập chủ đề bất kỳ và AI sẽ tạo bài kiểm tra cho bạn trong tích tắc.</p>
            
            <div className="relative max-w-lg mx-auto mb-8">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Lịch sử Nhật Bản, Nguyên lý kế toán..."
                // Added pr-40 to prevent text from going under the button
                className="w-full pl-5 pr-40 py-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-lg transition-all shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateQuiz(topic)}
              />
              <button
                onClick={() => handleGenerateQuiz(topic)}
                disabled={!topic.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 rounded-lg font-medium transition-all duration-200 shadow-md shadow-indigo-200"
              >
                Tạo bài tập
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-sm font-medium">Gợi ý chủ đề</span>
                <button 
                  onClick={handleRefreshSuggestions}
                  className="p-1 hover:bg-slate-100 rounded-full hover:text-indigo-600 transition-colors"
                  title="Đổi gợi ý khác"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleGenerateQuiz(suggestion)}
                    className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full text-sm font-medium transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {quizState.loading && <LoadingSpinner />}

        {/* Error State */}
        {quizState.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            <p className="font-medium">{quizState.error}</p>
            <button 
              onClick={() => handleGenerateQuiz(topic)}
              className="mt-2 text-sm underline hover:text-red-800"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Quiz Content */}
        {quizState.data && !quizState.loading && (
          <div className="animate-fade-in">
            {/* Quiz Header & Score */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-indigo-500 uppercase">Chủ đề</span>
                <h2 className="text-3xl font-bold text-slate-900">{quizState.data.quiz_title}</h2>
              </div>
              
              {quizState.isSubmitted && (
                <div className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                  <div>
                    <p className="text-xs text-indigo-200 font-medium uppercase">Kết quả</p>
                    <p className="text-2xl font-bold leading-none">{quizState.score} / {quizState.data.questions.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center">
                    {quizState.score > quizState.data.questions.length / 2 ? '🎉' : '📚'}
                  </div>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div>
              {quizState.data.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  index={index}
                  question={question}
                  selectedAnswer={quizState.userAnswers[question.id]}
                  onSelect={handleAnswerSelect}
                  isSubmitted={quizState.isSubmitted}
                />
              ))}
            </div>

            {/* Submit Button */}
            {!quizState.isSubmitted && (
              <div className="sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex justify-between items-center">
                 <div className="text-sm text-slate-500 ml-2">
                    Đã chọn <span className="font-bold text-indigo-600">{Object.keys(quizState.userAnswers).length}</span> / {quizState.data.questions.length} câu
                 </div>
                 <button
                  onClick={handleSubmit}
                  disabled={Object.keys(quizState.userAnswers).length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                >
                  Nộp bài
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;