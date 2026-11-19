import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 15, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const notesQuery = Note.find();

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (tag) {
    notesQuery.where({ tag: tag });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
    notes,
    totalNotes,
    totalPages,
    page,
    perPage,
  });
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