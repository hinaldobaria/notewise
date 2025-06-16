import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  User, 
  Settings, 
  LogOut, 
  Save, 
  Lock, 
  Unlock,
  Menu,
  X,
  Edit2,
  Check,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Note, User as UserType } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { NotesList } from './NotesList';
import { AIInsights } from './AIInsights';
import { Avatar } from './Avatar';
import { storage } from '../utils/storage';
import { aiUtils } from '../utils/ai';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
  onShowProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onShowProfile }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState<string>('');
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiKeyPoints, setAiKeyPoints] = useState<string[]>([]);
  const [showAiResults, setShowAiResults] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [grammarSuggestions, setGrammarSuggestions] = useState<string[]>([]);
  const [showGrammarModal, setShowGrammarModal] = useState(false);
  const [grammarCorrected, setGrammarCorrected] = useState('');
  const [activeAISection, setActiveAISection] = useState<'summary' | 'grammar' | null>(null);
  const [highlightedGrammar, setHighlightedGrammar] = useState('');

  // Load notes on component mount
  useEffect(() => {
    const userNotes = storage.getNotes(user.id);
    setNotes(userNotes);
    if (userNotes.length > 0) {
      setCurrentNote(userNotes[0]);
    }
  }, [user.id]);

  // Auto-save current note
  useEffect(() => {
    if (currentNote) {
      const timeoutId = setTimeout(() => {
        saveCurrentNote();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentNote?.content, currentNote?.htmlContent]);

  const saveAllNotes = () => {
    const allNotes = storage.getNotes('') || [];
    const otherUserNotes = allNotes.filter(note => note.userId !== user.id);
    const updatedNotes = [...otherUserNotes, ...notes];
    storage.saveNotes(updatedNotes);
  };

  const saveCurrentNote = async () => {
    if (!currentNote) return;

    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedNote = {
      ...currentNote,
      updatedAt: new Date().toISOString()
    };

    const updatedNotes = notes.map(note => 
      note.id === currentNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    setCurrentNote(updatedNote);
    saveAllNotes();
    setIsSaving(false);
  };

  const createNewNote = (title: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content: '',
      htmlContent: '',
      isPinned: false,
      isEncrypted: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setCurrentNote(newNote);
    saveAllNotes();
    setShowCreateNoteModal(false);
    setNewNoteTitle('');
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);

    if (currentNote?.id === noteId) {
      setCurrentNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
    }

    storage.deleteNote(noteId, user.id); // FIXED
    saveAllNotes();
  };

  const toggleNotePin = (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    );
    
    setNotes(updatedNotes);
    
    if (currentNote?.id === noteId) {
      setCurrentNote({ ...currentNote, isPinned: !currentNote.isPinned });
    }
    
    saveAllNotes();
  };

  const handleNoteContentChange = (content: string, htmlContent: string) => {
    if (!currentNote) return;

    const updatedNote = {
      ...currentNote,
      content,
      htmlContent
    };

    setCurrentNote(updatedNote);
  };

  const handleTitleEdit = () => {
    if (!currentNote) return;
    setTempTitle(currentNote.title);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (!currentNote || !tempTitle.trim()) return;

    const updatedNote = {
      ...currentNote,
      title: tempTitle.trim()
    };

    const updatedNotes = notes.map(note =>
      note.id === currentNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    setCurrentNote(updatedNote);
    setIsEditingTitle(false);
    saveAllNotes();
  };

  const toggleEncryption = () => {
    if (!currentNote) return;
    setShowEncryptionModal(true);
  };

  const handleEncryption = (password: string) => {
    if (!currentNote) return;

    try {
      let updatedNote;
      
      if (currentNote.isEncrypted) {
        // Decrypt
        const decryptedContent = storage.decrypt(currentNote.content, password);
        const decryptedHtmlContent = storage.decrypt(currentNote.htmlContent, password);
        updatedNote = {
          ...currentNote,
          content: decryptedContent,
          htmlContent: decryptedHtmlContent,
          isEncrypted: false
        };
      } else {
        // Encrypt
        const encryptedContent = storage.encrypt(currentNote.content, password);
        const encryptedHtmlContent = storage.encrypt(currentNote.htmlContent, password);
        updatedNote = {
          ...currentNote,
          content: encryptedContent,
          htmlContent: encryptedHtmlContent,
          isEncrypted: true
        };
      }

      const updatedNotes = notes.map(note =>
        note.id === currentNote.id ? updatedNote : note
      );

      setNotes(updatedNotes);
      setCurrentNote(updatedNote);
      saveAllNotes();
      setShowEncryptionModal(false);
      setEncryptionPassword('');
    } catch (error) {
      alert('Invalid password. Please try again.');
    }
  };

  const generateSummaryAndKeyPoints = async () => {
    if (!currentNote || !currentNote.content) return;
    setIsGeneratingAi(true);
    setActiveAISection('summary');
    try {
      const insights = await aiUtils.generateInsights(currentNote.content);
      setAiSummary(insights.summary);
      setAiKeyPoints(insights.keyPoints);
      setShowAiResults(true);
      setGrammarCorrected('');
    } catch (error) {
      setAiSummary('Failed to generate insights.');
      setAiKeyPoints([]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!currentNote) return;
    setIsGeneratingAi(true);
    setActiveAISection('grammar');
    try {
      const corrected = await aiUtils.correctGrammar(currentNote.content);
      setGrammarCorrected(corrected);

      // Highlight changed words
      const originalWords = currentNote.content.split(/\b/);
      const correctedWords = corrected.split(/\b/);
      let highlighted = '';
      for (let i = 0; i < correctedWords.length; i++) {
        if (originalWords[i] !== correctedWords[i]) {
          highlighted += `<span class="bg-yellow-200 underline">${correctedWords[i]}</span>`;
        } else {
          highlighted += correctedWords[i] || '';
        }
      }
      setHighlightedGrammar(highlighted);

      setShowAiResults(false);
    } catch (error) {
      setGrammarCorrected('Failed to check grammar.');
      setHighlightedGrammar('');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const sidebarContent = (
    <>
      <NotesList
        notes={notes}
        currentNote={currentNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNoteSelect={setCurrentNote}
        onNoteCreate={() => setShowCreateNoteModal(true)}
        onNoteDelete={deleteNote}
        onNotePin={toggleNotePin}
      />
    </>
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowMobileMenu(false)} />
          <div className="relative flex flex-col w-80 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">NoteWise</h1>
              </div>

              {/* Note Title */}
              {currentNote && (
                <div className="flex items-center space-x-2 ml-8">
                  {isEditingTitle ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                        autoFocus
                      />
                      <button
                        onClick={handleTitleSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold text-gray-800">{currentNote.title}</h2>
                      <button
                        onClick={handleTitleEdit}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Save Status */}
              {isSaving && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              )}

              {/* Note Actions */}
              {currentNote && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleEncryption}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors duration-200 ${
                      currentNote.isEncrypted ? 'text-yellow-600' : 'text-gray-600'
                    }`}
                    title={currentNote.isEncrypted ? 'Decrypt Note' : 'Encrypt Note'}
                  >
                    {currentNote.isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => setShowAIInsights(!showAIInsights)}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors duration-200 ${
                      showAIInsights ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'
                    }`}
                    title="Toggle AI Insights"
                  >
                    <Brain className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={onShowProfile}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
                >
                  <Avatar avatarId={user.avatar} size="sm" />
                  <span className="hidden sm:block font-medium text-gray-700">{user.name}</span>
                </button>
                
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded hover:text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex">
          {/* Main Editor */}
          <div className="flex-1 p-6 flex flex-col">
            {currentNote ? (
              <>
                <div className="flex-1 mb-6">
                  <RichTextEditor
                    content={currentNote.isEncrypted ? 'This note is encrypted. Please decrypt to view content.' : currentNote.htmlContent}
                    onChange={handleNoteContentChange}
                    className="h-full"
                    disabled={currentNote.isEncrypted}
                  />
                </div>

                {/* AI Action Buttons */}
                {!currentNote.isEncrypted && currentNote.content && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={generateSummaryAndKeyPoints}
                      className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center"
                      disabled={isGeneratingAi}
                    >
                      {isGeneratingAi && activeAISection === 'summary' && (
                        <span className="w-4 h-4 border-2 border-white border-t-indigo-600 rounded-full animate-spin mr-2"></span>
                      )}
                      Generate Summary & Key Points
                    </button>
                    <button
                      onClick={handleGrammarCheck}
                      className="px-4 py-2 bg-green-600 text-white rounded flex items-center"
                      disabled={isGeneratingAi}
                    >
                      {isGeneratingAi && activeAISection === 'grammar' && (
                        <span className="w-4 h-4 border-2 border-white border-t-green-600 rounded-full animate-spin mr-2"></span>
                      )}
                      Check Grammar
                    </button>
                  </div>
                )}

                {/* AI Results Area */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {activeAISection === 'summary' && showAiResults && (
                    <>
                      {aiSummary && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span>Summary</span>
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{aiSummary}</p>
                        </div>
                      )}
                      {aiKeyPoints.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4 text-purple-600" />
                            <span>Key Points</span>
                          </h4>
                          <ul className="space-y-1">
                            {aiKeyPoints.map((point, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  {activeAISection === 'grammar' && grammarCorrected && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <span>Corrected Sentence</span>
                      </h4>
                      <div className="bg-white border rounded p-2 mt-1 text-gray-800">
                        {grammarCorrected}
                      </div>
                      {highlightedGrammar && (
                        <div className="mt-2">
                          <span className="font-semibold">Changes Highlighted:</span>
                          <div
                            className="bg-white border rounded p-2 mt-1 text-gray-800"
                            dangerouslySetInnerHTML={{ __html: highlightedGrammar }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to NoteWise</h3>
                  <p className="mb-4">Create your first note to get started with AI-powered note-taking</p>
                  <button
                    onClick={() => setShowCreateNoteModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Create Your First Note
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <AIInsights
            content={currentNote?.content || ''}
            isVisible={showAIInsights}
            onClose={() => setShowAIInsights(false)}
          />
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && newNoteTitle.trim() && createNewNote(newNoteTitle)}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => createNewNote(newNoteTitle)}
                disabled={!newNoteTitle.trim()}
                className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Create Note
              </button>
              <button
                onClick={() => {
                  setShowCreateNoteModal(false);
                  setNewNoteTitle('');
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encryption Modal */}
      {showEncryptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentNote?.isEncrypted ? 'Decrypt Note' : 'Encrypt Note'}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentNote?.isEncrypted 
                ? 'Enter the password to decrypt this note' 
                : 'Enter a password to encrypt this note'
              }
            </p>
            <input
              type="password"
              value={encryptionPassword}
              onChange={(e) => setEncryptionPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleEncryption(encryptionPassword)}
                disabled={!encryptionPassword}
                className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {currentNote?.isEncrypted ? 'Decrypt' : 'Encrypt'}
              </button>
              <button
                onClick={() => {
                  setShowEncryptionModal(false);
                  setEncryptionPassword('');
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grammar Suggestions Modal */}
      {showGrammarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Suggestions</h3>
            <div className="space-y-4">
              {grammarSuggestions.length === 0 ? (
                <p className="text-gray-700 text-sm">No grammar issues found!</p>
              ) : (
                grammarSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-800">{suggestion}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowGrammarModal(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
