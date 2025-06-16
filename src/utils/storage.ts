import CryptoJS from 'crypto-js';
import { User, Note } from '../types';

const STORAGE_KEYS = {
  USERS: 'notewise_users',
  NOTES: 'notewise_notes',
  CURRENT_USER: 'notewise_current_user'
};

export const storage = {
  // User management
  saveUser: (user: User): void => {
    const users = storage.getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getUsers: (): User[] => {
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersData ? JSON.parse(usersData) : [];
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Notes management
  saveNote: (note: Note): void => {
    const notes = storage.getNotes(note.userId);
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);

    if (existingNoteIndex >= 0) {
      notes[existingNoteIndex] = note;
    } else {
      notes.push(note);
    }

    // Save all notes for all users
    const allNotesData = localStorage.getItem(STORAGE_KEYS.NOTES);
    let allNotes: Note[] = allNotesData ? JSON.parse(allNotesData) : [];
    // Remove notes for this user, then add updated notes
    allNotes = allNotes.filter(n => n.userId !== note.userId).concat(notes);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
  },

  saveNotes: (notes: Note[]): void => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getNotes: (userId: string): Note[] => {
    const notesData = localStorage.getItem(STORAGE_KEYS.NOTES);
    const allNotes: Note[] = notesData ? JSON.parse(notesData) : [];
    return allNotes.filter(note => note.userId === userId);
  },

  deleteNote: (noteId: string, userId: string): void => {
    const notes = storage.getNotes(userId);
    const updatedNotes = notes.filter(note => note.id !== noteId);

    // Save all notes for all users
    const allNotesData = localStorage.getItem(STORAGE_KEYS.NOTES);
    let allNotes: Note[] = allNotesData ? JSON.parse(allNotesData) : [];
    allNotes = allNotes.filter(n => n.userId !== userId).concat(updatedNotes);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
  },

  // Encryption utilities
  encrypt: (text: string, password: string): string => {
    return CryptoJS.AES.encrypt(text, password).toString();
  },

  decrypt: (encryptedText: string, password: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, password);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error('Invalid password');
      return decrypted;
    } catch (error) {
      throw new Error('Invalid password');
    }
  }
};