import React, { useState, useEffect } from 'react';
import { Brain, Clock, BookOpen, Hash, Lightbulb, X } from 'lucide-react';
import { aiUtils } from '../utils/ai';

interface AIInsightsProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
}

// Export the AIInsights type or interface
export type AIInsights = {
  wordCount: number;
  readingTime: number;
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
  // Add other fields if needed
};

export const AIInsights: React.FC<AIInsightsProps> = ({ content, isVisible, onClose }) => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      const insights = await aiUtils.generateInsights(content);
      setInsights(insights);
      setIsLoading(false);
    };
    if (isVisible && content) fetchInsights();
  }, [isVisible, content]);

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">AI Insights</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Analyzing your note...</span>
            </div>
          </div>
        ) : insights ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <Hash className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-indigo-900">{insights.wordCount}</div>
                <div className="text-xs text-indigo-600">Words</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-900">{insights.readingTime}</div>
                <div className="text-xs text-purple-600">Min Read</div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Summary</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                {insights.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <h4 className="font-semibold text-gray-900">Key Points</h4>
              </div>
              <ul className="space-y-2">
                {insights.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Topics */}
            {insights.relatedTopics.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-semibold text-gray-900">Related Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.relatedTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Glossary Terms */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold text-gray-900">Glossary Terms</h4>
              </div>
              <div className="space-y-2">
                {aiUtils.findGlossaryTerms(content).slice(0, 3).map((term, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3">
                    <div className="font-medium text-green-900 text-sm">{term.term}</div>
                    <div className="text-xs text-green-700 mt-1">{term.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No content to analyze yet.</p>
            <p className="text-sm mt-1">Start writing to see AI insights!</p>
          </div>
        )}
      </div>
    </div>
  );
};