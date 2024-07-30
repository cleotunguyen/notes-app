import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Initialize new Express application
const app = express();

// Initialize Prisma client
const prisma = new PrismaClient();

// Parse JSON body from incoming API requests
app.use(express.json());

// Add CORS support
app.use(cors());

// ------ "GET" Endpoint
app.get("/api/notes", async (req, res) => {
  try {
    // Query database
    const notes = await prisma.note.findMany();
    // Include the notes in the response
    res.json(notes);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

// ------ "POST" Endpoint : Create a new note
app.post("/api/notes", async (req, res) => {
  // Extract title and content of note
  const { title, content } = req.body;

  if (!title || !content) {
    // Return 400 Bad Request status if title or content missing
    return res.status(400).send("Title and content fields required");
  }

  try {
    // Create new note with appropriate title and content with Prisma Client
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    // Handle Prisma client error
    res.status(500).send("Oops, something went wrong");
  }
});

// ------ "PUT" Endpoint : Update a note
app.put("/api/notes/:id", async (req, res) => {
  // Extract title and content of note
  const { title, content } = req.body;
  // Extract id of note and convert to integer
  const id = parseInt(req.params.id);

  // Return 400 Bad Request status if title or content missing
  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  // Return 400 Bad Request status if id is not a number
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    // Update note with Prisma Client
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    // Handle Prisma client error
    res.status(500).send("Oops, something went wrong");
  }
});

// ------ "DELETE" Endpoint : Delete a note

app.delete("/api/notes/:id", async (req, res) => {
  // Extract id of note
  const id = parseInt(req.params.id);

  // Return 400 Bad Request status if id is not a valid number
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    // Delete note with Prisma Client
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

// Start server listening on port 5000
app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});
