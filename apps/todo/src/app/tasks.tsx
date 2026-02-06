/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 This is a starter component and can be deleted.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Delete this file and get started with your project!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
import {useEffect, useState} from 'react';

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3333/api')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTasks(data.tasks);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <ol>
      {tasks.map((task, idx) => (<li key={idx}>{task}</li>))}
    </ol>
  );
}

export default Tasks;
