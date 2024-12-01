import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../types";

interface ProjectsState {
  items: Record<string, Project>;
  loading: boolean;
  error: null | string;
}

const initialState: ProjectsState = {
  items: {},
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    createDraft: (state, action: PayloadAction<Project>) => {
      const project = { ...action.payload, status: "draft" as const };
      state.items[project.id] = project;
    },

    deleteProject: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },

    updateProject: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Project> }>
    ) => {
      const { id, updates } = action.payload;
      if (state.items[id]) {
        state.items[id] = { ...state.items[id], ...updates };
      }
    },

    markAsActive: (state, action: PayloadAction<string>) => {
      if (state.items[action.payload]) {
        state.items[action.payload].status = "active";
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createDraft,
  deleteProject,
  updateProject,
  markAsActive,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer;
