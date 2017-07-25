import React, { Component, PropTypes } from 'react';
import { moveToInProgress, editTaskModal, deleteTaskModal, moveToFinished, moveToToDo } from '../../helpers/taskFunctions';

import styles from './styles.scss';

export default class Task extends Component {
  static propTypes = {
    firebaseDb: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
  };

  _todoTask() {
    return (
      <div className={`${styles.task} ${styles.taskTodo} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-arrow-right ${styles.taskButton}`} onClick={moveToInProgress(this.props.firebaseDb, this.props.userId, this.props.id)} />
            <button className={`glyphicon glyphicon-pencil ${styles.taskButton}`} onClick={editTaskModal(this.props.firebaseDb, this.props.userId, this.props.id)} />
            <button className={`glyphicon glyphicon-trash ${styles.taskButton}`}onClick={deleteTaskModal(this.props.firebaseDb, this.props.userId, this.props.id)} />
          </div>
        </div>
      </div>
    );
  }

  _inprogressTask() {
    return (
      <div className={`${styles.task} ${styles.taskInProgress} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-arrow-left ${styles.taskButton}`}onClick={moveToToDo(this.props.firebaseDb, this.props.userId, this.props.id)} />
            <button className={`glyphicon glyphicon-arrow-right ${styles.taskButton}`} onClick={moveToFinished(this.props.firebaseDb, this.props.userId, this.props.id)} />
            <button className={`glyphicon glyphicon-pencil ${styles.taskButton}`} onClick={editTaskModal(this.props.firebaseDb, this.props.userId, this.props.id)} />
            <button className={`glyphicon glyphicon-trash ${styles.taskButton}`} onClick={deleteTaskModal(this.props.firebaseDb, this.props.userId, this.props.id)} />
          </div>
        </div>
      </div>
    );
  }

  _finishedTask() {
    return (
      <div className={`${styles.task} ${styles.taskFinished} animated fadeInUp`}>
        <span className={styles.taskDuration}>{this.props.duration} hours</span>
        <br />
        <span className={styles.taskTitle}>{this.props.title}</span>
        <br />
        <div className="clearfix">
          <div className="pull-right">
            <button className={`glyphicon glyphicon-trash pull-right ${styles.taskButton}`} onClick={deleteTaskModal(this.props.firebaseDb, this.props.userId, this.props.id)} />
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
