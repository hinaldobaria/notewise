import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Undo,
  Redo,
  Mic,
  MicOff,
  Type
} from 'lucide-react';
import { voiceRecognition } from '../utils/voice';
import { aiUtils } from '../utils/ai';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, htmlContent: string) => void;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  className = '',
  disabled = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [grammarIssues, setGrammarIssues] = useState<string[]>([]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    // Update grammar issues when content changes
    let isMounted = true;
    if (!disabled) {
      aiUtils.correctGrammar(content).then((issue: string) => {
        if (isMounted) setGrammarIssues(issue ? [issue] : []);
      });
    } else {
      setGrammarIssues([]);
    }
    return () => { isMounted = false; };
  }, [content, disabled]);

  const handleInput = () => {
    if (editorRef.current && !disabled) {
      const htmlContent = editorRef.current.innerHTML;
      const textContent = editorRef.current.innerText;
      onChange(textContent, htmlContent);
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleVoiceToggle = () => {
    if (disabled) return;
    
    if (!voiceRecognition.isAvailable()) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceRecognition.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceRecognition.startListening(
        (transcript, isFinal) => {
          if (editorRef.current && isFinal) {
            // Insert the transcript at cursor position
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(transcript + ' '));
              
              // Move cursor to end of inserted text
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
              
              handleInput();
            }
          }
        },
        (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
        }
      );
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    if (disabled) return;
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${newSize}px`;
    }
    editorRef.current?.focus();
  };

  const toolbarButtons = [
    { icon: <Bold className="w-4 h-4" />, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: <Italic className="w-4 h-4" />, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: <Underline className="w-4 h-4" />, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: <AlignLeft className="w-4 h-4" />, command: 'justifyLeft', title: 'Align Left' },
    { icon: <AlignCenter className="w-4 h-4" />, command: 'justifyCenter', title: 'Align Center' },
    { icon: <AlignRight className="w-4 h-4" />, command: 'justifyRight', title: 'Align Right' },
    { icon: <Undo className="w-4 h-4" />, command: 'undo', title: 'Undo (Ctrl+Z)' },
    { icon: <Redo className="w-4 h-4" />, command: 'redo', title: 'Redo (Ctrl+Y)' },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className} ${disabled ? 'opacity-60' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => execCommand(button.command)}
              title={button.title}
              disabled={disabled}
              className="p-2 rounded hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {button.icon}
            </button>
          ))}
          
          {/* Font Size Control */}
          <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
            <Type className="w-4 h-4 text-gray-600" />
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              disabled={disabled}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
              <option value={20}>20px</option>
              <option value={24}>24px</option>
            </select>
          </div>
        </div>

        {/* Voice Input Button */}
        <button
          onClick={handleVoiceToggle}
          title={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
          disabled={disabled}
          className={`p-2 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className={`p-4 min-h-96 focus:outline-none leading-relaxed relative ${disabled ? 'cursor-not-allowed' : ''}`}
        style={{ fontSize: `${fontSize}px` }}
        suppressContentEditableWarning={true}
        aria-label="Rich text editor"
      />
     

      
    </div>
  );
};