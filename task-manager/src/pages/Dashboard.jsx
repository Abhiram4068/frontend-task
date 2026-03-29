import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskManager from '../features/tasks/TaskManager';
import TaskDetail from '../features/tasks/TaskDetail';
import FilesManager from '../features/files/FilesManager';
import FileDetail from '../features/files/FileDetail';

export default function Dashboard() {
  const { pathname } = useLocation();

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background: 'var(--bg-base)' }}>
      <Navbar />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar currentPath={pathname} />
        <Routes>
          <Route path="/" element={<Navigate to="tasks/all" replace />} />
          <Route path="tasks" element={<Navigate to="tasks/all" replace />} />
          <Route path="tasks/:view" element={<TaskManager />} />
          <Route path="task/:id" element={<TaskDetail />} />
          <Route path="files" element={<Navigate to="files/files" replace />} />
          <Route path="files/:mode" element={<FilesManager />} />
          <Route path="file/:id" element={<FileDetail />} />
          <Route path="*" element={<Navigate to="tasks/all" replace />} />
        </Routes>
      </div>
    </div>
  );
}