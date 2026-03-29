import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/tasks/tasksSlice';
import TaskItem from '../features/tasks/TaskItem';
import TaskForm from '../features/tasks/TaskForm';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.tasks);
  
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalTasks = list.length;
  const completedTasks = list.filter(t => t.is_completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const cards = [
    { title: 'Total Tasks', count: totalTasks, color: 'var(--accent)' },
    { title: 'Completed Tasks', count: completedTasks, color: 'var(--success, #10b981)' },
    { title: 'Pending Tasks', count: pendingTasks, color: 'var(--warning, #f59e0b)' }
  ];

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleDone = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: 24, fontWeight: 600 }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-surface)',
            padding: 24,
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>{card.title}</h3>
            <span style={{ fontSize: 40, fontWeight: 700, color: card.color }}>{card.count}</span>
          </div>
        ))}
      </div>

      <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 600 }}>Recent Tasks</h3>
      
      {showForm && <TaskForm editing={editingTask} onDone={handleDone}/>}

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No tasks found. Create some above or in "My Tasks".</p>
        </div>
      ) : (
        <div>
          {list.map((task) => <TaskItem key={task.id} task={task} onEdit={handleEdit}/>)}
        </div>
      )}
    </div>
  );
}
