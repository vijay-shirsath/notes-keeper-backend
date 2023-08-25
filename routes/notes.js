import express from "express"
import { createNote, deleteNoteByNoteId, getNotesByUserId } from "../controllers/Note.js";

const router = express.Router();
router.post("/create",createNote);
router.get("/get/:userId",getNotesByUserId);
router.delete("/:noteId",deleteNoteByNoteId);
export default router;