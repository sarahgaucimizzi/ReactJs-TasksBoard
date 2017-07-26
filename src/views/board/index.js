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
    this.setState({
      firebaseDb: nextProps.firebase.database(),
      userId: nextProps.userId,
    });

    this._fetchTasks(nextProps.userId);
  }

  _logout = () => {
    this.state.firebaseAuth.signOut().then(() => {
    }).catch((error) => {
      showErrorNotification(error.message);
    });
  }

  _onTitleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  }

  _onDurationChange = (event) => {
    this.setState({
      duration: parseInt(event.target.value, 10),
    });
  }

  _addTaskModal = () => {
    this.setState({
      openAddTaskModal: true,
    });
  }

  _addTask = () => {
    const duration = parseInt(this.state.duration, 10);

    if (this.state.title !== '' && !isNaN(duration)) {
      if (duration > 8) {
        showWarningNotification('In progress only allows up to 8 hours at a time.');
      } else if ((this.state.todoHoursCount + duration) <= 24) {
        this._addTaskFirebase(this.state.title, duration);
        this._closeAddTaskModal();
      } else {
        showWarningNotification('Cannot have more than 24 hours in the todo column');
      }
    } else {
      showWarningNotification('Please fill in the fields.');
    }
  };

  _closeAddTaskModal = () => {
    this.setState({
      openAddTaskModal: false,
    });
  }

  _editTaskModal = (taskId) => {
    const taskURL = this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`);
    taskURL.once('value', (snapshot) => {
      const task = snapshot.val();
      this.setState({
        taskId: snapshot.key,
        title: task.title,
        duration: parseInt(task.duration, 10),
        state: task.state,
        openEditTaskModal: true,
      });
    });
  }

  _editTask = () => {
    const duration = parseInt(this.state.duration, 10);

    if (this.state.title !== '' && !isNaN(duration)) {
      if (duration > 8) {
        showWarningNotification('In progress only allows up to 8 hours at a time.');
      } else if (this.state.state === 'todo') {
        if ((this.state.todoHoursCount + duration) <= 24) {
          this._editTaskFirebase(this.state.taskId, { title: this.state.title, duration, state: 'todo', isDeleted: false });

          this._closeEditTaskModal();
        } else {
          showWarningNotification('Cannot have more than 24 hours in the todo column');
        }
      } else if (this.state.state === 'inprogress') {
        if ((this.state.inprogressCount + duration) <= 8) {
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

  _closeEditTaskModal = () => {
    this.setState({
      openEditTaskModal: false,
    });
  }

  _deleteTaskModal = (taskId) => {
    const taskURL = this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`);
    taskURL.once('value', (snapshot) => {
      const task = snapshot.val();
      this.setState({
        taskId: snapshot.key,
        title: task.title,
        duration: parseInt(task.duration, 10),
        state: task.state,
        openDeleteTaskModal: true,
      });
    });
  }

  _deleteTask = () => {
    this._editTaskFirebase(this.state.taskId, { title: this.state.title, duration: this.state.duration, state: this.state.state, isDeleted: true });
    this._closeDeleteTaskModal();
  }

  _closeDeleteTaskModal = () => {
    this.setState({
      openDeleteTaskModal: false,
    });
  }

  _addTaskFirebase = (title, duration) => {
    const newNode = this.state.firebaseDb.ref(`tasks/${this.state.userId}`).push();
    newNode.set({
      title,
      duration,
      state: 'todo',
      isDeleted: false,
    });
  }

  _editTaskFirebase = (taskId, updatedTask) => {
    this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`).set({
      title: updatedTask.title,
      duration: updatedTask.duration,
      state: updatedTask.state,
      isDeleted: updatedTask.isDeleted,
    });
  }

  _moveToTodo = (taskId) => {
    const taskURL = this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`);
    taskURL.once('value', (snapshot) => {
      const task = snapshot.val();

      if ((this.state.todoHoursCount + task.duration) <= 24) {
        this._editTaskFirebase(taskId, { title: task.title, duration: task.duration, state: 'todo', isDeleted: false });
        this.setState({
          todoHoursCount: this.state.todoHoursCount + task.duration,
          inprogressCount: this.state.inprogressCount - task.duration,
        });
      } else {
        showWarningNotification('Cannot have more than 24 hours in the todo column');
      }
    });
  }

  _moveToInProgress = (taskId) => {
    const taskURL = this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`);
    taskURL.once('value', (snapshot) => {
      const task = snapshot.val();

      if ((this.state.inprogressHoursCount + task.duration) <= 8) {
        this._editTaskFirebase(taskId, { title: task.title, duration: task.duration, state: 'inprogress', isDeleted: false });
        this.setState({
          todoHoursCount: this.state.todoHoursCount - task.duration,
          inprogressCount: this.state.inprogressCount + task.duration,
        });
      } else {
        showWarningNotification('Cannot have more than 8 hours in the in progress column');
      }
    });
  }

  _moveToFinished = (taskId) => {
    const taskURL = this.state.firebaseDb.ref(`tasks/${this.state.userId}/${taskId}`);
    taskURL.once('value', (snapshot) => {
      const task = snapshot.val();

      this._editTaskFirebase(taskId, { title: task.title, duration: task.duration, state: 'finished', isDeleted: false });
      this.setState({
        inprogressCount: this.state.inprogressCount - task.duration,
      });
    });
  }

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
            <h1>Board</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-info pull-right add-button" onClick={this._addTaskModal}>+</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div id="tasksContainer-todo">{this._renderTodoTasks()}</div>
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-inprogress">{this._renderInProgressTasks()}</div>
          </div>
          <div className="col-md-4">
            <div id="tasksContainer-finished">{this._renderFinishedTasks()}</div>
          </div>
        </div>
        <ReactModal isOpen={this.state.openAddTaskModal} onRequestClose={this._closeAddTaskModal} contentLabel="Add new Task">
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
        <ReactModal isOpen={this.state.openEditTaskModal} onRequestClose={this._closeEditTaskModal} contentLabel="Edit Task">
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
        <ReactModal isOpen={this.state.openDeleteTaskModal} onRequestClose={this._closeDeleteTaskModal} contentLabel="Delete Task">
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
      </div>
    );
  }
}
