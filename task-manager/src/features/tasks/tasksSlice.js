import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchTasks   = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/task/'); 
    return data?.tasks || [];
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch tasks');
  }
});
export const createTask   = createAsyncThunk('tasks/create', async (task, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/task/', task);
    return data?.task || null;
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to create task');
  }
});
export const updateTask   = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/task/${id}/update/`, data);
    return res.data?.task || null;
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to update task');
  }
});
export const deleteTask   = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/task/${id}/delete/`);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to delete task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending,     (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchTasks.fulfilled,   (s, a) => { s.status = 'succeeded'; s.list = [...a.payload].reverse(); })
      .addCase(fetchTasks.rejected,    (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(createTask.fulfilled,   (s, a) => {
        if (a.payload) s.list.unshift(a.payload);
      })
      .addCase(updateTask.fulfilled,   (s, a) => {
        if (!a.payload) return;
        const i = s.list.findIndex((t) => t.id === a.payload.id);
        if (i !== -1) s.list[i] = { ...s.list[i], ...a.payload };
      })
      .addCase(deleteTask.fulfilled,   (s, a) => { s.list = s.list.filter((t) => t.id !== a.payload); });
  },
});

export default tasksSlice.reducer;