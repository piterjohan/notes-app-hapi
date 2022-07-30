/* eslint-disable brace-style */
/* eslint-disable padded-blocks */
/* eslint-disable space-in-parens */
const { nanoid } = require('nanoid');
const notes = require('./notes');

/**
 * get all note
 * @returns json
 */
const getALLNotesHandler = () => ({
  status: 'sucess',
  data: {
    notes,
  },
});

/**
 * get note by id
 * @param {request} request
 * @param {h} h
 * @returns json
 */
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  console.log(id);
  const note = notes.filter((n) => n.id === id)[0];

  // find the note
  if (note !== undefined) {
    return {
      status: 'sucess',
      data: {
        note,
      },
    };
  }

  // note not found
  const response = h.request({
    status: 'fail',
    message: 'Note tidak ditemukan',
  });
  response.code(404);
  return response;
};

/**
 * Post Notes
 * @param {request} request
 * @param {h} h
 * @returns json
 */
const addNoteHandler = (request, h) => {
  // get the request
  const { title, tags, body } = request.payload;
  // add new attribute
  const id = nanoid(16);
  const createdAt = new Date().toISOString;
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  console.log('data:', newNote);

  notes.push(newNote);

  // check if success insert
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note berhasil di tambahkan',
      data: {
        noteID: id,
      },
    });

    response.code(201);
    return response;
  }

  // not success
  const response = h.response({
    status: 'fail',
    message: 'Note gagal ditambahkan',
  });

  response.code(500);
  return response;
};

/**
 * @param {request} request
 * @param {h} h
 * @returns json
 */
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  // get note
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
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // not success
  const response = h.response({
    status: 'fail',
    message: 'Note gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  getALLNotesHandler,
  addNoteHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
