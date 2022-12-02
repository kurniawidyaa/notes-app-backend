const { nanoid } = require('nanoid');
const notes = require('./notes');

// function to add notes
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  // payload = cara mendapatkan body request di Hapi

  const id = nanoid(16); // nanoid -> for generate id automatic
  const createdAt = new Date().toISOString;
  const updatedAt = createdAt;

  const newNote = {
    tags,
    body,
    id,
    title,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201); // mengambil status respon success
    return response; // mengembalikan nilai
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500); // internal server error
  return response;
};

// function to show notes
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNotesByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// function edit note
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'sucess',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal diperbarui',
  });

  response.code(404); // not found
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotesByIdHandler,
  editNoteByIdHandler,
};

/*
notes:
1.Spread operator pada kode di atas digunakan untuk mempertahankan nilai notes[index]
   yang tidak perlu diubah
*/
