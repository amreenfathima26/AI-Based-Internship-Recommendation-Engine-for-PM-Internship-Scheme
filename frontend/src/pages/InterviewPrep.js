import React, { useState } from 'react';
import { Mic, Play, Award, HelpCircle, ChevronRight, RotateCcw, Volume2, User, Layout, MessageSquare } from 'lucide-react';
import config from './../config';

const InterviewPrep = () => {
    const [role, setRole] = useState('Product Manager');
    const [topic, setTopic] = useState('Behavioral');
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const startSession = async () => {
        setLoading(true);
        setQuestions([]);
        setCurrentQIndex(0);
        setFeedback(null);

        try {
            const res = await fetch(`${config.API_BASE_URL}/api/interview/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, topic })
            });
            const data = await res.json();
            setQuestions(data.questions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer) return;
        setLoading(true);

        try {
            const res = await fetch(`${config.API_BASE_URL}/api/interview/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: questions[currentQIndex],
                    answer
                })
            });
            const data = await res.json();
            setFeedback(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        setCurrentQIndex(prev => prev + 1);
        setAnswer('');
        setFeedback(null);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                🎙️ AI Mock Interviewer
            </h1>

            {questions.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h2 className="text-xl font-semibold mb-6">Configure Your Session</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                        <div>
                            <label className="block text-left font-medium mb-2">Target Role</label>
                            <select
                                className="w-full p-3 border rounded-lg"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Product Manager</option>
                                <option>Software Engineer</option>
                                <option>Data Scientist</option>
                                <option>UX Designer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-left font-medium mb-2">Topic</label>
                            <select
                                className="w-full p-3 border rounded-lg"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                <option>Behavioral</option>
                                <option>Technical</option>
                                <option>System Design</option>
                                <option>Strategy</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={startSession}
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                    >
                        {loading ? 'Generating Questions...' : <><Play size={20} /> Start Interview</>}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar / Progress */}
                    <div className="bg-white p-4 rounded-xl shadow-sm h-fit">
                        <h3 className="font-bold mb-4 text-gray-500 uppercase text-xs tracking-wider">Session Progress</h3>
                        <div className="space-y-2">
                            {questions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg text-sm truncate cursor-default ${idx === currentQIndex ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Q{idx + 1}: {q}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Interaction Area */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                            <h2 className="text-lg font-medium text-gray-500 mb-2">Question {currentQIndex + 1} of {questions.length}</h2>
                            <p className="text-xl font-bold text-gray-800">{questions[currentQIndex]}</p>
                        </div>

                        {!feedback ? (
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <textarea
                                    className="w-full h-40 p-4 border-none outline-none resize-none text-gray-700 placeholder-gray-300"
                                    placeholder="Type your answer here... (Speak naturally)"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                                <div className="flex justify-between items-center border-t pt-4 mt-2">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Mic size={20} />
                                    </button>
                                    <button
                                        onClick={submitAnswer}
                                        disabled={!answer || loading}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Evaluating...' : <><Send size={16} /> Submit Answer</>}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100 animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-green-800 flex items-center gap-2">
                                        <MessageSquare size={20} /> AI Feedback
                                    </h3>
                                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
                                        Score: {feedback.score}/10
                                    </span>
                                </div>
                                <p className="text-green-800 mb-6 leading-relaxed">{feedback.feedback}</p>

                                {currentQIndex < questions.length - 1 ? (
                                    <button
                                        onClick={nextQuestion}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold"
                                    >
                                        Next Question →
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => startSession()} // Reset
                                        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-bold"
                                    >
                                        Finish Session
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewPrep;
