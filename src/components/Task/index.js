import React, { Component, PropTypes } from 'react';

import styles from './styles.scss';

export default class Task extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
    editTaskModal: PropTypes.func.isRequired,
    deleteTaskModal: PropTypes.func.isRequired,
    moveToTodo: PropTypes.func.isRequired,
    moveToInProgress: PropTypes.func.isRequired,
    moveToFinished: PropTypes.func.isRequired,
  };

  _todoTask() {
    // Todo Task Template
    return (
      <div className={`${styles.task} ${styles.taskTodo} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-arrow-right ${styles.taskButton}`} onClick={() => this.props.moveToInProgress(this.props.id)} />
            <button className={`glyphicon glyphicon-pencil ${styles.taskButton}`} onClick={() => this.props.editTaskModal(this.props.id)} />
            <button className={`glyphicon glyphicon-trash ${styles.taskButton}`} onClick={() => this.props.deleteTaskModal(this.props.id)} />
          </div>
        </div>
      </div>
    );
  }

  _inprogressTask() {
    // In Progress Task Template
    return (
      <div className={`${styles.task} ${styles.taskInProgress} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-arrow-left ${styles.taskButton}`} onClick={() => this.props.moveToTodo(this.props.id)} />
            <button className={`glyphicon glyphicon-arrow-right ${styles.taskButton}`} onClick={() => this.props.moveToFinished(this.props.id)} />
            <button className={`glyphicon glyphicon-pencil ${styles.taskButton}`} onClick={() => this.props.editTaskModal(this.props.id)} />
            <button className={`glyphicon glyphicon-trash ${styles.taskButton}`} onClick={() => this.props.deleteTaskModal(this.props.id)} />
          </div>
        </div>
      </div>
    );
  }

  _finishedTask() {
    // Finished Task Template
    return (
      <div className={`${styles.task} ${styles.taskFinished} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-trash pull-right ${styles.taskButton}`} onClick={() => this.props.deleteTaskModal(this.props.id)} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    switch (this.props.state) {
      case 'todo':
        return this._todoTask();
      case 'inprogress':
        return this._inprogressTask();
      case 'finished':
        return this._finishedTask();
      default:
        return null;
    }
  }
}
