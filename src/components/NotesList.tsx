import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Lock, 
  Trash2, 
  Edit3,
  Calendar,
  Tag
} from 'lucide-react';
import { Note } from '../types';

interface NotesListProps {
  notes: Note[];
  currentNote: Note | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  onNotePin: (noteId: string) => void;
  className?: string;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  currentNote,
  searchQuery,
  onSearchChange,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNotePin,
  className = ''
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by update date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleDeleteNote = (noteId: string) => {
    onNoteDelete(noteId);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-full w-80 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Notes</h2>
          <button
            onClick={onNoteCreate}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            title="Create New Note"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No notes found</p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className={`group p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                  currentNote?.id === note.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 line-clamp-1 flex-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    {note.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {note.isEncrypted && (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotePin(note.id);
                      }}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors duration-150 ${
                        note.isPinned ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(note.id);
                      }}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors duration-150"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteNote(showDeleteConfirm)}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};