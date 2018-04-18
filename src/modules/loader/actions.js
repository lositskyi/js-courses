import { questionTypes } from './';

const setLoader = (value, name) => ({
  type: questionTypes.SET_LOADER,
  name,
  value
});

// THIS IS ASYNC ACTION
const createQuestion = (db, document, history) => dispatch => {
	dispatch(setLoader(true, questionTypes.CREATE_QUESTION));
  // TODO: HOMEWORK 9: set loader to start loading (true), loader name is questionTypes.CREATE_QUESTION
  setTimeout(() => {
    // emulating server work
    db.questions.insert(document);
    history.push('/');
    dispatch(setLoader(false, questionTypes.CREATE_QUESTION));
  }, 1000);
  // TODO: HOMEWORK 9: set loader to end loading (false)
};

export default { setLoader, createQuestion }