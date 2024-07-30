import "./App.css";
import { useEffect, useState } from "react";
import React from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  //   // Create Dummy Notes (remove after fetching from API)
  //   {
  //     id: 1,
  //     title: "Test note 1",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 2,
  //     title: "Test note 2 ",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 3,
  //     title: "Test note 3",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 4,
  //     title: "Test note 4 ",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 5,
  //     title: "Test note 5",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 6,
  //     title: "Test note 6",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 7,
  //     title: "Test note 7",
  //     content: "note content placeholder",
  //   },
  //   {
  //     id: 8,
  //     title: "Test note 8",
  //     content: "note content placeholder",
  //   },
  // ]);

  // State for Form Inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Track selected note
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Get and Display Notes with useEffect hook
  useEffect(() => {
    const fetchNotes = async () => {
      // Handle errors from API
      try {
        // Use fetch function to call API
        const response = await fetch("http://localhost:5000/api/notes");
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        // Convert response to JSON
        const notes: Note[] = await response.json();
        // Update state with notes fetched from API
        setNotes(notes);
      } catch (e) {
        // Log errors
        console.error(e);
      }
    };
    // Call fetchNotes
    fetchNotes();
    // Add empty dependency array so the code inside useEffect hook only runs ONCE on mount
  }, []);

  // Handle Clicking on a note
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // Handle Add Note (Form Submission)
  const handleAddNote = async (event: React.FormEvent) => {
    // Prevent form from submitting and refreshing page
    event.preventDefault();

    // // Create a New Note Object on the frontend (remove after fetching API)
    // const newNote: Note = {
    //   id: notes.length + 1,
    //   title: title,
    //   content: content,
    // };

    // Handle API error
    try {
      // Call API
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        // Add header to request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add note");
      }
      // Convert response to JSON and store in newNote
      const newNote = await response.json();

      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      // Log errors
      console.error(e);
    }
  };

  // // Move state function calls inside "try-catch" block after API fetching
  //   // Update State with New Note
  //   setNotes([newNote, ...notes]);

  //   // Reset Form Inputs
  //   setTitle("");
  //   setContent("");
  // };

  // Handle Updating Note

  const handleUpdateNote = async (event: React.FormEvent) => {
    // Prevent form from automatically submitting when clicking save button
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    // // Move after fetching API
    // const updatedNote: Note = {
    //   id: selectedNote.id,
    //   title: title,
    //   content: content,
    // };

    // Replace selected notes with updated notes that match id
    // const updatedNotesList = notes.map((note) =>
    //   note.id === selectedNote.id ? updatedNote : note
    // );

    // Update the notes in the database by calling API
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();

      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );

      // Update states
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (e) {
      console.error("Fail to update note:", e);
    }
  };

  // Handle user canceling the update (reset the form)
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  // Handle Deleting Notes
  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      // Filter selected note
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      setNotes(updatedNotes);
    } catch (e) {
      console.error(e);
    }
  };

  // OPTIONAL: Handle returning to home page after selecting a note
  const handleReturnToHome = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  return (
    //  -- Start app-container
    <div className="app-container">
      <div className="editNoteContainer">
        {/* Back Button */}
        {selectedNote && (
          <button className="back-button" onClick={handleReturnToHome}>
            {/* Back Button Icon SVG - Start */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3c73ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {/* Back Button Icon SVG - End */}
          </button>
        )}

        {/* Start Form */}
        <form
          className="note-form"
          onSubmit={(event) =>
            selectedNote ? handleUpdateNote(event) : handleAddNote(event)
          }
        >
          {/* Title Input Field */}
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            required
          ></input>
          {/* Content Input Field */}
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Content"
            rows={10}
            required
          />
          {/* Display Button based on whether a note is selected for editing */}
          {selectedNote ? (
            // Edit Buttons
            <div className="edit-buttons">
              {/* Save Button */}
              <button type="submit">Save</button>
              {/* Cancel Button */}
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            // Add Button
            <button type="submit">Add Note</button>
          )}
        </form>
        {/* End Form */}
      </div>

      {/* Start notes-grid */}
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={() => handleNoteClick(note)}
          >
            {/* Individual Note */}
            <div className="notes-header">
              {/* Delete note button */}
              <button onClick={(event) => deleteNote(event, note.id)}>
                {/* Delete Icon SVG - Start */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3c73ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                {/* Delete Icon SVG - End */}
              </button>
            </div>

            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
      {/* End notes-grid */}
    </div>
    // End app-container
  );
};

export default App;
