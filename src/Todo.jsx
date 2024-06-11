import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './firebase_config';
import './App.css';

function Todo() {
  const [tasks, setTask] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todo-tasks'));
        const dataList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTask(dataList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleTaskChange = async () => {
    if (inputValue.trim() !== "") {
      const newTask = { name: inputValue, completed: false };
      const docRef = await addDoc(collection(db, "todo-tasks"), newTask);
      setTask([...tasks, { ...newTask, id: docRef.id }]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const removeTask = async (taskId) => {
    await deleteDoc(doc(db, "todo-tasks", taskId));
    setTask(prev => prev.filter(task => task.id !== taskId));
  };

  const editTaskChange = async (taskId, newTaskName) => {
    await updateDoc(doc(db, "todo-tasks", taskId), { name: newTaskName });
    setTask(prev => prev.map(task => task.id === taskId ? { ...task, name: newTaskName } : task));
    setEditTask(null);
    setEditInput("");
  };

  const startEdit = (taskId, currentName) => {
    setEditTask(taskId);
    setEditInput(currentName);
  };

  const toggleComplete = async (taskId, currentStatus) => {
    const updatedStatus = !currentStatus;
    await updateDoc(doc(db, "todo-tasks", taskId), { completed: updatedStatus });
    setTask(prev => prev.map(task => task.id === taskId ? { ...task, completed: updatedStatus } : task));
  };

  const pendingTask = tasks.filter(task => !task.completed);
  const completedTask = tasks.filter(task => task.completed);

  return (
    <div className="container">
      <h1 className="text-center">Todo List</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New Task"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="input-group-append">
          <button type="button" className="btn btn-success" onClick={handleTaskChange}>Add</button>
        </div>
      </div>
      <div className='task'>
      <div className='pending-task'>

      <h2>Pending Tasks</h2>
      <ul className="task-list">
        {pendingTask.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            {editTask === task.id ? (
              <div>
                <input
                  type="text"
                  className="form-control"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => editTaskChange(task.id, editInput)}>Save</button>
              </div>
            ) : (
              <div className="d-flex justify-content-between w-100">
                <span>{task.name}</span>
                <div className='buttons'>
                  <button className="btn btn-warning" onClick={() => startEdit(task.id, task.name)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => removeTask(task.id)}>Remove</button>
                  <button className="btn btn-info" onClick={() => toggleComplete(task.id, task.completed)}>Mark as Complete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </ul>
      </div>
      
      
      <div className='completed-task'>

      <h2>Completed Tasks</h2>
      <ul className="task-list">
        {completedTask.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <span>{task.name}</span>
            <div className='buttons' >
              <button className="btn btn-danger" onClick={() => removeTask(task.id)}>Remove</button>
              <button className="btn btn-info" onClick={() => toggleComplete(task.id, task.completed)}>Mark as Pending</button>
            </div>
          </div>
        ))}
      </ul>
      </div>
        
      </div>
      
    </div>
  );
}

export default Todo;
