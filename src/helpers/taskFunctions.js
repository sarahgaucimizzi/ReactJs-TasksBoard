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

export const showTask = (id, duration, isDeleted, state, title) => {
  switch (state) {
    case 'todo':
      todoHoursCount += duration;
      // $('#tasksContainer-todo').append('<div class="task task-todo animated fadeInUp"><span class="task-duration">' + duration + ' hours </span><br /><span class="task-title">' + title + '</span><br /><div class="clearfix"><div class="pull-right"><button class="glyphicon glyphicon-arrow-right task-button" onclick="moveToInProgress(\'' + userId + '\',\'' + id + '\')"></button><button class="glyphicon glyphicon-pencil task-button" onclick="editTaskModal(\'' + userId + '\',\'' + id + '\')"></button><button class="glyphicon glyphicon-trash task-button pull-right" onclick="deleteTaskModal(\'' + userId + '\',\'' + id + '\')"></button></div></div></div>');
      break;
    case 'inprogress':
      inprogressHoursCount += duration;
      // $('#tasksContainer-inprogress').append('<div class="task task-inprogress animated fadeInUp"><span class="task-duration">' + duration + ' hours </span><br /><span class="task-title">' + title + '</span><br /><div class="clearfix"><div class="pull-right"><button class="glyphicon glyphicon-arrow-left task-button" onclick="moveToToDo(\'' + userId + '\',\'' + id + '\')"></button><button class="glyphicon glyphicon-arrow-right task-button" onclick="moveToFinished(\'' + userId + '\',\'' + id + '\')"></button><button class="glyphicon glyphicon-pencil task-button" onclick="editTaskModal(\'' + userId + '\',\'' + id + '\')"></button><button class="glyphicon glyphicon-trash task-button" onclick="deleteTaskModal(\'' + userId + '\',\'' + id + '\')"></button></div></div></div>');
      break;
    case 'finished':
      // $('#tasksContainer-finished').append('<div class="task task-finished animated fadeInUp"><span class="task-duration">' + duration + ' hours </span><br /><span class="task-title">' + title + '</span><br /><div class="clearfix"><button class="glyphicon glyphicon-trash task-button pull-right" onclick="deleteTaskModal(\'' + userId + '\',\'' + id + '\')"></button></div></div>');
      break;
    default:
      break;
  }
};

export const fetchTasks = (firebaseDb, userId) => {
  const userTasks = firebaseDb.ref(`tasks/${userId}`).orderByChild('isDeleted').equalTo(false);
  userTasks.on('value', (snapshot) => {
    $('#tasksContainer-todo').empty();
    $('#tasksContainer-inprogress').empty();
    $('#tasksContainer-finished').empty();

    todoHoursCount = 0;
    inprogressHoursCount = 0;

    const data = snapshot.val();

    snapshot.forEach(() => {
      showTask(data.key, data.val().duration, data.val().isDeleted, data.val().state, data.val().title);
    });
  });
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
