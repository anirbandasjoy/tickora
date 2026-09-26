import { NoteModel, type NoteDocument } from '../models/note.model';
import type { CreateNoteInput } from '../schemas/note.schema';

export async function createNote(
  ownerId: string,
  input: CreateNoteInput,
): Promise<NoteDocument> {
  return NoteModel.create({ ...input, ownerId });
}

export async function listNotes(ownerId: string): Promise<NoteDocument[]> {
  return NoteModel.find({ ownerId }).sort({ createdAt: -1 });
}

export async function getNote(id: string, ownerId: string): Promise<NoteDocument | null> {
  return NoteModel.findOne({ _id: id, ownerId });
}

export async function updateNote(
  id: string,
  ownerId: string,
  input: Partial<CreateNoteInput>,
): Promise<NoteDocument | null> {
  return NoteModel.findOneAndUpdate({ _id: id, ownerId }, input, { new: true });
}

export async function deleteNote(id: string, ownerId: string): Promise<NoteDocument | null> {
  return NoteModel.findOneAndDelete({ _id: id, ownerId });
}
