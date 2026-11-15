import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!updatedNote) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(updatedNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const deletedNote = await Note.findByIdAndDelete(noteId);

  if (!deletedNote) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(deletedNote);
};