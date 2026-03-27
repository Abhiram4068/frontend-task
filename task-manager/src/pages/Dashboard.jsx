import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskManager from '../features/tasks/TaskManager';
import FilesManager from '../features/files/FilesManager';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('all');

  const isTaskView = ['all', 'add', 'pending', 'completed'].includes(activeView);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <Navbar />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        {isTaskView ? (
          <TaskManager activeView={activeView} onChangeView={setActiveView} />
        ) : (
          <FilesManager mode={activeView} onChangeView={setActiveView} />
        )}
      </div>
    </div>
  );
}