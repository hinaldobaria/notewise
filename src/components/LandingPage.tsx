import React from 'react';
import { FileText, Brain, Shield, Mic, Search, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Rich Text Editor',
      description: 'Create beautifully formatted notes with our custom built-from-scratch editor'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Insights',
      description: 'Get smart summaries, glossary highlights, and grammar suggestions'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Password-protect sensitive notes with military-grade encryption'
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'Voice to Text',
      description: 'Speak your thoughts and watch them transform into perfectly formatted notes'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Smart Search',
      description: 'Find any note instantly with powerful search and tagging features'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Personal Touch',
      description: 'Express yourself with Bitmoji-style avatars and customizable themes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-yellow-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">NoteWise</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI-Powered</span>
            <br />Note-Taking Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform the way you capture, organize, and understand your thoughts with NoteWise's 
            intelligent features, beautiful design, and powerful customization options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Start Taking Smart Notes
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 font-semibold text-lg">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-500 ml-4">My Project Notes</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-yellow-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-indigo-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Stay Organized
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to enhance your productivity and creativity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Note-Taking?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who've already upgraded their productivity with NoteWise
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 font-semibold text-lg shadow-lg"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NoteWise</span>
          </div>
          <p className="text-gray-400">
            Built with ❤️ for Playpower Labs • Empowering minds through intelligent note-taking
          </p>
        </div>
      </footer>
    </div>
  );
};