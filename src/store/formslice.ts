import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; 
  validations?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
  derived?: {
    parents: string[];
    formula: string; 
  };
}

export interface FormSchema {
  name: string;
  createdAt: string;
  fields: Field[];
}

interface FormState {
  currentForm: FormSchema;
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: { name: '', createdAt: '', fields: [] },
  savedForms: JSON.parse(localStorage.getItem('forms') || '[]'),
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Field>) => {
      state.currentForm.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<Field>) => {
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.currentForm.fields[index] = action.payload;
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<Field[]>) => {
      state.currentForm.fields = action.payload;
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const newForm = {
        ...state.currentForm,
        name: action.payload,
        createdAt: new Date().toISOString(),
      };
      state.savedForms.push(newForm);
      localStorage.setItem('forms', JSON.stringify(state.savedForms));
      state.currentForm = { name: '', createdAt: '', fields: [] };
    }
  }
});

export const { addField, updateField, deleteField, reorderFields, saveForm } = formSlice.actions;
export default formSlice.reducer;
