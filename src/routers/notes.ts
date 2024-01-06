import { Hono, validator } from "hono/mod.ts";
import { z } from "zod";
import {
  createNote,
  deleteNote,
  editNote,
  getNoteById,
  getNotes,
} from "$/controllers/notes.ts";

const NoteSchema = z.object({
  title: z.string().min(8),
  description: z.string().min(10),
  body: z.string().min(20),
  page: z.string().url().optional(),
});

const router_notes = new Hono();

router_notes.get("/", getNotes);

router_notes.post(
  "/create",
  validator("json", (value, c) => {
    const parsed = NoteSchema.safeParse(value);
    if (!parsed.success) {
      c.status(400);
      return c.json(parsed.error);
    }

    return parsed.data;
  }),
  createNote,
);

router_notes.get("/:id", getNoteById);

router_notes.put(
  "/:id",
  validator("json", (value, c) => {
    const parsed = NoteSchema.safeParse(value);
    if (!parsed.success) {
      c.status(400);
      return c.json(parsed.error);
    }

    return parsed.data;
  }),
  editNote,
);

router_notes.delete("/:id", deleteNote);

export default router_notes;
