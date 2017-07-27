import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import Task from '../../components/Task';

import { showErrorNotification, showWarningNotification } from '../../helpers/common';

import styles from './styles.scss';

export default class Board extends Component {
  static propTypes = {
    firebase: PropTypes.any,
    userId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      firebaseAuth: this.props.firebase.auth(),
      firebaseDb: this.props.firebase.database(),
      userId: this.props.userId,
      todoHoursCount: 0,
      inprogressCount: 0,
      taskId: '',
      title: '',
      duration: '',
      state: '',
      openAddTaskModal: false,
      openEditTaskModal: false,
      openDeleteTaskModal: false,
      todoTasks: [],
      inprogressTasks: [],
      finishedTasks: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Update state with newProps and fetch all tasks for that user
    this.setState({
      firebaseAuth: nextProps.firebase.auth(),
      firebaseDb: nextProps.firebase.database(),
      userId: nextProps.userId,
    });

    this._fetchTasks(nextProps.userId);
  }

  _logout = () => {
    this.state.firebaseAuth.signOut().then(() => {
      // Auth listener will be triggered and redirect to login
    }).catch((error) => {
      showErrorNotification(error.message);
    });
  }

  // Supervised form element: Title
  _onTitleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  }

  // Supervised form element: Duration
  _onDurationChange = (event) => {
    this.setState({
      duration: parseInt(event.target.value, 10),
    });
  }

  // Open modal and clear out current task data
  _addTaskModal = () => {
    this.setState({
      openAddTaskModal: true,
      taskId: '',
      title: '',
      state: 'todo',
      duration: '',
    });
  }

  _addTask = () => {
    const duration = parseInt(this.state.duration, 10);

    if (this.state.title !== '' && !isNaN(duration)) {
      if (duration > 8) {
        // One task alone cannot be more than 8 hours or it will never be able to go in progress
        showWarningNotification('In progress only allows up to 8 hours at a time.');
      } else if ((this.state.todoHoursCount + duration) <= 24) {
        // Todo column can have up to 24 hours in total
        this._addTaskFirebase(this.state.title, duration);
        this._closeAddTaskModal();
      } else {
        showWarningNotification('Cannot have more than 24 hours in the todo column');
      }
    } else {
      showWarningNotification('Please fill in the fields.');
    }
  };

  // Close modal
  _closeAddTaskModal = () => {
    this.setState({
      openAddTaskModal: false,
    });
  }

  // Open edit modal if task found. Only those in todo and in progress can be edited
  _editTaskModal = (taskId) => {
    const task = this.state.todoTasks.filter(item => item.id === taskId);
    if (task[0] !== undefined) {
      this.setState({
        taskId,
        title: task[0].title,
        duration: parseInt(task[0].duration, 10),
        state: task[0].state,
        openEditTaskModal: true,
      });
    } else {
      const inprogressTask = this.state.inprogressTasks.filter(item => item.id === taskId);
      if (inprogressTask[0] !== undefined) {
        this.setState({
          taskId,
          title: inprogressTask[0].title,
          duration: parseInt(inprogressTask[0].duration, 10),
          state: inprogressTask[0].state,
          openEditTaskModal: true,
        });
      } else {
        showErrorNotification('Task not found. Try again.');
      }
    }
  }

  _editTask = () => {
    const duration = parseInt(this.state.duration, 10);

    if (this.state.title !== '' && !isNaN(duration)) {
      if (duration > 8) {
        // One task alone cannot be more than 8 hours or it will never be able to go in progress. in Progress allows up to 8 hours only.
        showWarningNotification('In progress only allows up to 8 hours at a time.');
      } else if (this.state.state === 'todo') {
        if ((this.state.todoHoursCount + duration) <= 24) {
          // If the task edit is still within 24 hour range - edit it and close modal
          this._editTaskFirebase(this.state.taskId, { title: this.state.title, duration, state: 'todo', isDeleted: false });

          this._closeEditTaskModal();
        } else {
          showWarningNotification('Cannot have more than 24 hours in the todo column');
        }
      } else if (this.state.state === 'inprogress') {
        if ((this.state.inprogressCount + duration) <= 8) {
          // If the task edit is still within 8 hour range - edit it and close modal
          this._editTaskFirebase(this.state.taskId, { title: this.state.title, duration, state: 'inprogress', isDeleted: false });

          this._closeEditTaskModal();
        } else {
          showWarningNotification('Cannot have more than 8 hours in the in progress column');
        }
      } else {
        showErrorNotification('Something went wrong. Try again.');
      }
    } else {
      showWarningNotification('Please fill in the fields.');
    }
  }

  // Close modal
  _closeEditTaskModal = () => {
    this.setState({
      openEditTaskModal: false,
    });
  }

  // Open modal if task found in todo or in progress or finished
  _deleteTaskModal = (taskId) => {
    const task = this.state.todoTasks.filter(item => item.id === taskId);
    if (task[0] !== undefined) {
      this.setState({
        taskId,
        title: task[0].title,
        duration: parseInt(task[0].duration, 10),
        state: task[0].state,
        openDeleteTaskModal: true,
      });
    } else {
      const inprogressTask = this.state.inprogressTasks.filter(item => item.id === taskId);
      if (inprogressTask[0] !== undefined) {
        this.setState({
          taskId,
          title: inprogressTask[0].title,
          duration: parseInt(inprogressTask[0].duration, 10),
          state: inprogressTask[0].state,
          openDeleteTaskModal: true,
        });
      } else {
        const finishedTasks = this.state.finishedTasks.filter(item => item.id === taskId);
        if (finishedTasks[0] !== undefined) {
          this.setState({
            taskId,
            title: finishedTasks[0].title,
            duration: parseInt(finishedTasks[0].duration, 10),
            state: finishedTasks[0].state,
            openDeleteTaskModal: true,
          });
        } else {
          showErrorNotification('Task not found. Try again.');
        }
      }
    }
  }

  // Soft delete task
  _deleteTask = () => {
    this._editTaskFirebase(this.state.taskId, { title: this.state.title, duration: this.state.duration, state: this.state.state, isDeleted: true });
    this._closeDeleteTaskModal();
  }

  // Close modal
  _closeDeleteTaskModal = () => {
    this.setState({
      openDeleteTaskModal: false,
    });
  }

  // Push new task to firebase for the user
  _addTaskFirebase = (title, duration) => {
    const newNode = this.state.firebaseDb.ref(`tasks/${this.state.userId}`).push();
    newNode.set({
      title,
      duration,
      state: 'todo',
      isDeleted: false,
    });
  }

  // Update task in firebase with changes
  _editTaskFirebase = (taskId, updatedTask) => {
    this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`).set({
      title: updatedTask.title,
      duration: updatedTask.duration,
      state: updatedTask.state,
      isDeleted: updatedTask.isDeleted,
    });
  }

  // Only ones in progress can go to todo - if found and in range update with new state
  _moveToTodo = (taskId) => {
    const task = this.state.inprogressTasks.filter(item => item.id === taskId);
    if (task[0] !== undefined) {
      if ((this.state.todoHoursCount + task[0].duration) <= 24) {
        this._editTaskFirebase(taskId, { title: task[0].title, duration: task[0].duration, state: 'todo', isDeleted: false });
        this.setState({
          todoHoursCount: this.state.todoHoursCount + task[0].duration,
          inprogressCount: this.state.inprogressCount - task[0].duration,
        });
      } else {
        showWarningNotification('Cannot have more than 24 hours in the todo column');
      }
    } else {
      showErrorNotification('Task not found. Try again.');
    }
  }

  // Only ones todo can go to in progress - if found and in range update with new state
  _moveToInProgress = (taskId) => {
    const task = this.state.todoTasks.filter(item => item.id === taskId);
    if (task[0] !== undefined) {
      if ((this.state.inprogressHoursCount + task[0].duration) <= 8) {
        this._editTaskFirebase(taskId, { title: task[0].title, duration: task[0].duration, state: 'inprogress', isDeleted: false });
        this.setState({
          todoHoursCount: this.state.todoHoursCount - task[0].duration,
          inprogressCount: this.state.inprogressCount + task[0].duration,
        });
      } else {
        showWarningNotification('Cannot have more than 8 hours in the in progress column');
      }
    } else {
      showErrorNotification('Task not found. Try again.');
    }
  }

  // Only ones in progress can go to finished - if found update new state
  _moveToFinished = (taskId) => {
    const task = this.state.inprogressTasks.filter(item => item.id === taskId);
    if (task[0] !== undefined) {
      this._editTaskFirebase(taskId, { title: task[0].title, duration: task[0].duration, state: 'finished', isDeleted: false });
      this.setState({
        inprogressCount: this.state.inprogressCount - task[0].duration,
      });
    } else {
      showErrorNotification('Task not found. Try again.');
    }
  }

  // Retrieve all tasks for the user, set the state which triggers a render to update the board
  _fetchTasks = (userId = this.state.userId) => {
    if (userId !== null || userId !== '' || userId !== undefined) {
      const userTasks = this.state.firebaseDb.ref(`tasks/${userId}`).orderByChild('isDeleted').equalTo(false);
      userTasks.on('value', (snapshot) => {
        let todoHoursCount = 0;
        let inprogressHoursCount = 0;
        const todoTasks = [];
        const inprogressTasks = [];
        const finishedTasks = [];

        snapshot.forEach((data) => {
          const task = data.val();
          switch (task.state) {
            case 'todo':
              todoHoursCount += parseInt(task.duration, 10);
              todoTasks.push({ id: data.key, duration: parseInt(task.duration, 10), isDeleted: task.isDeleted, state: task.state, title: task.title });
              break;
            case 'inprogress':
              inprogressHoursCount += parseInt(task.duration, 10);
              inprogressTasks.push({ id: data.key, duration: parseInt(task.duration, 10), isDeleted: task.isDeleted, state: task.state, title: task.title });
              break;
            case 'finished':
              finishedTasks.push({ id: data.key, duration: parseInt(task.duration, 10), isDeleted: task.isDeleted, state: task.state, title: task.title });
              break;
            default:
              break;
          }
        });

        this.setState({
          todoHoursCount,
          inprogressHoursCount,
          todoTasks,
          inprogressTasks,
          finishedTasks,
        });
      });
    }
  }

  // Loop through tasks and render
  _renderTodoTasks() {
    return this.state.todoTasks.map((item, index) =>
      <Task
        id={item.id}
        title={item.title}
        state={item.state}
        isDeleted={item.isDeleted}
        duration={item.duration}
        editTaskModal={this._editTaskModal}
        deleteTaskModal={this._deleteTaskModal}
        moveToTodo={this._moveToTodo}
        moveToInProgress={this._moveToInProgress}
        moveToFinished={this._moveToFinished}
        key={index}
      />);
  }

  // Loop through tasks and render
  _renderInProgressTasks() {
    return this.state.inprogressTasks.map((item, index) =>
      <Task
        id={item.id}
        title={item.title}
        state={item.state}
        isDeleted={item.isDeleted}
        duration={item.duration}
        editTaskModal={this._editTaskModal}
        deleteTaskModal={this._deleteTaskModal}
        moveToTodo={this._moveToTodo}
        moveToInProgress={this._moveToInProgress}
        moveToFinished={this._moveToFinished}
        key={index}
      />);
  }

  // Loop through tasks and render
  _renderFinishedTasks() {
    return this.state.finishedTasks.map((item, index) =>
      <Task
        id={item.id}
        title={item.title}
        state={item.state}
        isDeleted={item.isDeleted}
        duration={item.duration}
        editTaskModal={this._editTaskModal}
        deleteTaskModal={this._deleteTaskModal}
        moveToTodo={this._moveToTodo}
        moveToInProgress={this._moveToInProgress}
        moveToFinished={this._moveToFinished}
        key={index}
      />);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button className={`btn btn-danger pull-right ${styles.logoutButton}`} onClick={this._logout}>Logout</button>
            <h1 className={styles.headerTitle}>Tasks Board</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div id="tasksContainer-todo"><h2 className={styles.columnHeader}>Todo</h2>{this._renderTodoTasks()}</div>
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-inprogress"><h2 className={styles.columnHeader}>In Progress</h2>{this._renderInProgressTasks()}</div>
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-finished"><h2 className={styles.columnHeader}>Finished</h2>{this._renderFinishedTasks()}</div>
          </div>
        </div>
        <ReactModal className={styles.reactModalContent} shouldCloseOnOverlayClick portalClassName={styles.reactModalOverlay} isOpen={this.state.openAddTaskModal} onRequestClose={this._closeAddTaskModal} contentLabel="Add new Task">
          <div id="addTaskForm">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" className="form-control" name="title" placeholder="Title" required value={this.state.title} onChange={this._onTitleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input type="number" className="form-control" name="duration" placeholder="Duration in Hours" required value={this.state.duration} onChange={this._onDurationChange} />
            </div>
            <hr />
            <div className="clearfix">
              <button className="btn btn-default" onClick={this._closeAddTaskModal}>Cancel</button>
              <div className="pull-right">
                <button className="btn btn-success" onClick={this._addTask}>Add</button>
              </div>
            </div>
          </div>
        </ReactModal>
        <ReactModal className={styles.reactModalContent} shouldCloseOnOverlayClick portalClassName={styles.reactModalOverlay} isOpen={this.state.openEditTaskModal} onRequestClose={this._closeEditTaskModal} contentLabel="Edit Task">
          <div id="editTaskForm">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" className="form-control" name="title" placeholder="Title" required value={this.state.title} onChange={this._onTitleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input type="number" className="form-control" name="duration" placeholder="Duration in Hours" required value={this.state.duration} onChange={this._onDurationChange} />
            </div>
            <hr />
            <div className="clearfix">
              <button className="btn btn-default" onClick={this._closeEditTaskModal}>Cancel</button>
              <div className="pull-right">
                <button className="btn btn-success" onClick={this._editTask}>Edit</button>
              </div>
            </div>
          </div>
        </ReactModal>
        <ReactModal className={styles.reactModalDeleteContent} shouldCloseOnOverlayClick portalClassName={styles.reactModalOverlay} isOpen={this.state.openDeleteTaskModal} onRequestClose={this._closeDeleteTaskModal} contentLabel="Delete Task">
          <div>
            Are you sure you want to delete the task?
            <hr />
            <div className="clearfix">
              <button className="btn btn-default" onClick={this._closeDeleteTaskModal}>Cancel</button>
              <div className="pull-right">
                <button className="btn btn-danger" onClick={this._deleteTask}>Delete</button>
              </div>
            </div>
          </div>
        </ReactModal>
        <button className={`btn ${styles.addButton}`} onClick={this._addTaskModal}>+</button>
      </div>
    );
  }
}
