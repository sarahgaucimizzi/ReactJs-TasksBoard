import React from 'react';
import Task from '../components/Task';

let todoHoursCount = 0;
let inprogressHoursCount = 0;

export const showErrorNotification = (errorMessage) => {
  $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'ERROR',
    message: `Message received from server:  ${errorMessage}`,
  }, {
    // settings
    type: 'danger',
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'right',
    },
    offset: 20,
    spacing: 10,
    z_index: 1051,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp',
    },
  });
};

export const showWarningNotification = (errorMessage) => {
  $.notify({
    // options
    icon: 'glyphicon glyphicon-warning-sign',
    title: 'WARNING',
    message: errorMessage,
  }, {
    // settings
    type: 'warning',
    allow_dismiss: true,
    newest_on_top: false,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'right',
    },
    offset: 20,
    spacing: 10,
    z_index: 1051,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp',
    },
  });
};

export const showTask = (firebaseDb, userId, id, duration, isDeleted, state, title) => {
  switch (state) {
    case 'todo':
      todoHoursCount += duration;
      break;
    case 'inprogress':
      inprogressHoursCount += duration;
      break;
    default:
      break;
  }

  return <Task firebaseDb={firebaseDb} userId={userId} id={id} duration={duration} isDeleted={isDeleted} state={state} title={title} />;
};

export const fetchTasks = (firebaseDb, userId) => {
  if (userId !== null || userId !== '' || userId !== undefined) {
    const userTasks = firebaseDb.ref(`tasks/${userId}`).orderByChild('isDeleted').equalTo(false);
    userTasks.on('value', (snapshot) => {
      todoHoursCount = 0;
      inprogressHoursCount = 0;
      console.log(snapshot.val());

      return snapshot.forEach((data) => { console.log(data.val()); showTask(firebaseDb, userId, data.key, data.val().duration, data.val().isDeleted, data.val().state, data.val().title); });
    });
  }

  return null;
};

export const addTask = (firebaseDb, userId, title, duration) => {
  const newNode = firebaseDb.ref(`tasks/${userId}`).push();

  newNode.set({
    title,
    duration,
    state: 'todo',
    isDeleted: false,
  });
};

export const editTask = (firebaseDb, userId, taskId, updatedTask) => {
  firebaseDb.ref(`tasks/${userId}/${taskId}`).set({
    title: updatedTask.title,
    duration: updatedTask.duration,
    state: updatedTask.state,
    isDeleted: updatedTask.isDeleted,
  });
};

export const moveToToDo = (firebaseDb, userId, taskId) => {
  const taskURL = firebaseDb.ref(`tasks/${userId}/${taskId}`);
  taskURL.once('value', (snapshot) => {
    const task = snapshot.val();

    if ((todoHoursCount + task.duration) <= 24) {
      editTask(userId, taskId, { title: task.title, duration: task.duration, state: 'todo', isDeleted: false });
    } else {
      showWarningNotification('Cannot have more than 24 hours in the todo column');
    }
  });
};

export const moveToInProgress = (firebaseDb, userId, taskId) => {
  const taskURL = firebaseDb.ref(`tasks/${userId}/${taskId}`);
  taskURL.once('value', (snapshot) => {
    const task = snapshot.val();

    if ((inprogressHoursCount + task.duration) <= 8) {
      editTask(userId, taskId, { title: task.title, duration: task.duration, state: 'inprogress', isDeleted: false });
    } else {
      showWarningNotification('Cannot have more than 8 hours in the in progress column');
    }
  });
};

export const moveToFinished = (firebaseDb, userId, taskId) => {
  const taskURL = firebaseDb.ref(`tasks/${userId}/${taskId}`);
  taskURL.once('value', (snapshot) => {
    const task = snapshot.val();

    editTask(userId, taskId, { title: task.title, duration: task.duration, state: 'finished', isDeleted: false });
  });
};
