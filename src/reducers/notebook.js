/**
 * Created by yinchong on 2018/11/5
 */
'use strict';
import _ from 'lodash'
import {
  QUERY_NOTEBOOKS,
  QUERY_NOTES,
  QUERY_NOTEBOOK_LOADING,
  QUERY_NOTE_LOADING,

  UPSERT_GAS,
  UPSERT_NOTEBOOK_SUCCESS,
  UPSERT_NOTEBOOK_FAIL,
  UPSERT_NOTE_SUCCESS,
  UPSERT_NOTE_FAIL,
  UPSERT_NOTE_LOADING,

  UNLOCK_NOTE_SUCCESS,
  UNLOCK_NOTE_FAIL,
  UNLOCK_NOTEBOOK_SUCCESS,
  UNLOCK_NOTEBOOK_FAIL,
  UNLOCK_NOTE_LOADING,

  INSUFFICIENT_FUNDS,
} from "./../actions/actionTypes"

const initNotebook = {
  notebooks: [],
  notes: []
};

export default function notebook(state = initNotebook, action) {
  switch (action.type) {
    case QUERY_NOTEBOOK_LOADING:
    case QUERY_NOTE_LOADING:
    case QUERY_NOTEBOOKS:
    case QUERY_NOTES:

    case UNLOCK_NOTEBOOK_SUCCESS:
    case UNLOCK_NOTEBOOK_FAIL:
    case UNLOCK_NOTE_FAIL:
    case UNLOCK_NOTE_LOADING:

    case UPSERT_GAS:
    case UPSERT_NOTE_FAIL:
    case UPSERT_NOTEBOOK_FAIL:
    case UPSERT_NOTE_LOADING:
    case INSUFFICIENT_FUNDS:
      return Object.assign({}, state, action);

    case UPSERT_NOTEBOOK_SUCCESS: {
      let {notebooks} = state;
      let {notebook} = action;

      let index = _.findIndex(notebooks, {'id': notebook.id});

      if (index > -1) {
        notebooks.splice(index, 1, notebook);
      } else {
        notebooks.push(notebook);
      }
      return Object.assign({}, state, action);
    }
    case UPSERT_NOTE_SUCCESS: {

      let {notes, notebooks} = state;
      let {unconfirmed, notebook} = action;

      //修改notes state
      let noteIndex = _.findIndex(notes, {'id': unconfirmed.id});
      if (noteIndex > -1) {
        notes.splice(noteIndex, 1, unconfirmed);
      } else {
        notes.push(unconfirmed);
      }
      action.notes = notes;

      //修改notebooks state
      let notebookIndex = _.findIndex(notebooks, {'id': notebook.id});
      if (notebookIndex > -1) {
        notebooks.splice(notebookIndex, 1, notebook);
      } else {
        notebooks.push(notebook);
      }
      action.notebooks = notebooks;

      return Object.assign({}, state, action);
    }
    case UNLOCK_NOTE_SUCCESS: {
      let {unlockNote} = action;
      let {notes} = state;

      let noteIndex = _.findIndex(notes, {'id': unlockNote.id});
      if (noteIndex > -1) {
        notes.splice(noteIndex, 1, unlockNote);
        action.notes = notes;
      }

      return Object.assign({}, state, action);
    }
    default:
      return Object.assign({}, state, action);
  }
}