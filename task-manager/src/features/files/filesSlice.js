import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchFiles = createAsyncThunk('files/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/files/');
    // Backend sometimes returns { message: "No files uploaded yet" }
    return Array.isArray(res.data) ? res.data : (res.data?.files || []);
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch files');
  }
});

export const uploadFiles = createAsyncThunk('files/upload', async (fileList, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const files = Array.from(fileList || []);
    files.forEach((f) => formData.append('files', f));
    const res = await axiosInstance.post('/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data?.files || [];
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to upload files');
  }
});

export const generateDownloadUrl = createAsyncThunk(
  'files/generateDownloadUrl',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/${id}/token-generate/`);
      return res.data?.download_url || null;
    } catch (e) {
      return rejectWithValue(e.response?.data || 'Failed to generate download link');
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: { list: [], status: 'idle', error: null, uploadStatus: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchFiles.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.list = a.payload || [];
      })
      .addCase(fetchFiles.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })
      .addCase(uploadFiles.pending, (s) => {
        s.uploadStatus = 'loading';
        s.error = null;
      })
      .addCase(uploadFiles.fulfilled, (s) => {
        s.uploadStatus = 'succeeded';
      })
      .addCase(uploadFiles.rejected, (s, a) => {
        s.uploadStatus = 'failed';
        s.error = a.payload;
      });
  },
});

export default filesSlice.reducer;

