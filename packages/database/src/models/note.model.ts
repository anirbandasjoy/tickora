import { Schema, model, type HydratedDocument } from 'mongoose';
import type { Note } from '../schemas/note.schema';

const noteMongooseSchema = new Schema<Note>(
  {
    title: { type: String, required: true, maxlength: 200, trim: true },
    content: { type: String, default: '' },
    ownerId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

export type NoteDocument = HydratedDocument<Note>;

export const NoteModel = model<Note>('Note', noteMongooseSchema);
