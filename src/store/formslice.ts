import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ValidationRule {
  id: string
  type: "required" | "minLength" | "maxLength" | "email" | "password" | "custom"
  value?: string | number
  message?: string
}

interface DerivedField {
  enabled: boolean
  parentFields: string[]
  formula: string
  computationType: "age" | "sum" | "concat" | "custom"
}

interface Field {
  id: string
  type: string
  label: string
  required: boolean
  defaultValue: string
  validations: ValidationRule[]
  options: string[]
  derived: DerivedField
}

interface FormState {
  currentForm: {
    fields: Field[]
    name: string
  }
  savedForms: Array<{
    id: string
    name: string
    fields: Field[]
    createdAt: string
  }>
}

const initialState: FormState = {
  currentForm: {
    fields: [],
    name: "",
  },
  savedForms: [],
}

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Field>) => {
      state.currentForm.fields.push(action.payload)
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter((field) => field.id !== action.payload)
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const newForm = {
        id: Date.now().toString(),
        name: action.payload,
        fields: [...state.currentForm.fields],
        createdAt: new Date().toISOString(),
      }
      state.savedForms.push(newForm)
      state.currentForm.name = action.payload
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        fields: [],
        name: "",
      }
    },
    reorderFields: (state, action: PayloadAction<Field[]>) => {
      state.currentForm.fields = action.payload
    },
    loadForm: (state, action: PayloadAction<{ name: string; fields: Field[] }>) => {
      state.currentForm.name = action.payload.name
      state.currentForm.fields = action.payload.fields
    },
  },
})

export const { addField, deleteField, saveForm, clearCurrentForm, reorderFields, loadForm } = formSlice.actions
export default formSlice.reducer
