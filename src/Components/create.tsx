"use client"
import { useState } from "react"
import "../styles/create.css"
import { useDispatch, useSelector } from "react-redux"
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  IconButton,
  Box,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Switch,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import type { RootState } from "../store/store"
import { addField, deleteField, saveForm } from "../store/formslice"
import { v4 as uuidv4 } from "uuid"

const fieldTypes = ["text", "number", "textarea", "select", "radio", "checkbox", "date", "email", "password"] as const

type FieldType = (typeof fieldTypes)[number]

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
  type: FieldType
  label: string
  required: boolean
  defaultValue: string
  validations: ValidationRule[]
  options: string[]
  derived: DerivedField
}

export default function Create() {
  const dispatch = useDispatch()
  const fields = useSelector((state: RootState) => state.form.currentForm.fields)
  const [open, setOpen] = useState(false)
  const [formNameDialog, setFormNameDialog] = useState(false)
  const [formName, setFormName] = useState("")
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [newField, setNewField] = useState<Field>({
    id: "",
    type: "text",
    label: "",
    required: false,
    defaultValue: "",
    validations: [],
    options: [],
    derived: {
      enabled: false,
      parentFields: [],
      formula: "",
      computationType: "custom",
    },
  })

  const handleAddField = () => {
    dispatch(addField({ ...newField, id: uuidv4() }))
    setNewField({
      id: "",
      type: "text",
      label: "",
      required: false,
      defaultValue: "",
      validations: [],
      options: [],
      derived: {
        enabled: false,
        parentFields: [],
        formula: "",
        computationType: "custom",
      },
    })
    setOpen(false)
    setTabValue(0)
  }

  const handleSaveForm = () => {
    dispatch(saveForm(formName))
    setFormName("")
    setFormNameDialog(false)
    setShowSaveSuccess(true)
    setTimeout(() => {
      setShowSaveSuccess(false)
    }, 3000)
  }

  const addValidationRule = (type: ValidationRule["type"]) => {
    const newRule: ValidationRule = {
      id: uuidv4(),
      type,
      value: type === "password" ? 8 : type === "minLength" ? 1 : type === "maxLength" ? 100 : "",
      message: getDefaultValidationMessage(type),
    }
    setNewField({
      ...newField,
      validations: [...newField.validations, newRule],
    })
  }

  const removeValidationRule = (ruleId: string) => {
    setNewField({
      ...newField,
      validations: newField.validations.filter((rule) => rule.id !== ruleId),
    })
  }

  const updateValidationRule = (ruleId: string, updates: Partial<ValidationRule>) => {
    setNewField({
      ...newField,
      validations: newField.validations.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
    })
  }

  const getDefaultValidationMessage = (type: ValidationRule["type"]): string => {
    switch (type) {
      case "required":
        return "This field is required"
      case "minLength":
        return "Minimum length not met"
      case "maxLength":
        return "Maximum length exceeded"
      case "email":
        return "Please enter a valid email address"
      case "password":
        return "Password must be at least 8 characters and contain a number"
      case "custom":
        return "Custom validation failed"
      default:
        return "Validation failed"
    }
  }

  const toggleParentField = (fieldId: string) => {
    const isSelected = newField.derived.parentFields.includes(fieldId)
    setNewField({
      ...newField,
      derived: {
        ...newField.derived,
        parentFields: isSelected
          ? newField.derived.parentFields.filter((id) => id !== fieldId)
          : [...newField.derived.parentFields, fieldId],
      },
    })
  }

  const getFormulaPlaceholder = () => {
    switch (newField.derived.computationType) {
      case "age":
        return "Automatically calculates age from selected date of birth field"
      case "sum":
        return "parentField1 + parentField2"
      case "concat":
        return 'parentField1 + " " + parentField2'
      default:
        return "Enter custom formula using parentField1, parentField2, etc."
    }
  }

  // Filter fields for age computation - only show date fields
  const getAvailableParentFields = () => {
    if (newField.derived.computationType === "age") {
      return fields.filter((field) => field.type === "date")
    }
    return fields
  }

  return (
    <Box
      className="form-builder-container"
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "80vh",
        maxHeight: "100vh",
        bgcolor: "black",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        className="form-builder-header"
        sx={{
          flexShrink: 0,
          bgcolor: "linear-gradient(45deg, #7b1fa2, #9c27b0)",
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
          py: 2,
        }}
      >
        <Typography
          className="typography"
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#bb86fc",
            textAlign: "center",
          }}
        >
          DYNAMIC FORM BUILDER UPLIANCE.AI{" "}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpen(true)}
            sx={{ minWidth: { xs: "100%", sm: 180 } }}
          >
            Add New Field
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setFormNameDialog(true)}
            sx={{ minWidth: { xs: "100%", sm: 180 } }}
          >
            Save Form
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          height: 18,
          bgcolor: showSaveSuccess ? "success.main" : "transparent",
          color: showSaveSuccess ? "success.contrastText" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          fontWeight: "bold",
          fontSize: "1rem",
          gap: 1,
          userSelect: "none",
        }}
      >
        {showSaveSuccess && (
          <>
            <CheckCircleIcon fontSize="medium" />
            <span>Saved successfully!</span>
          </>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {fields.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              px: 3,
            }}
          >
            <Box>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                No fields added yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add New Field" to start building your form
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
              Form Fields ({fields.length})
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignContent: "flex-start",
              }}
            >
              {fields.map((field) => (
                <Box
                  key={field.id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                      md: "calc(33.333% - 11px)",
                      lg: "calc(25% - 12px)",
                    },
                    minWidth: 280,
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      height: 180,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        flex: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color="text.primary"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {field.label || "(No label)"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mb: 1,
                          }}
                        >
                          <Chip label={field.type} size="small" color="primary" variant="outlined" />
                          {field.required && <Chip label="Required" size="small" color="error" variant="outlined" />}
                          {field.derived?.enabled && (
                            <Chip label="Derived" size="small" color="secondary" variant="outlined" />
                          )}
                        </Box>
                        {field.defaultValue && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mb: 0.5,
                            }}
                          >
                            Default: {field.defaultValue}
                          </Typography>
                        )}
                        {field.validations?.length > 0 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            Validations: {field.validations.length} rule(s)
                          </Typography>
                        )}
                        {field.derived?.enabled && field.derived.parentFields.length > 0 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            Parents: {field.derived.parentFields.length} field(s)
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        color="error"
                        size="small"
                        aria-label={`Delete ${field.label}`}
                        onClick={() => dispatch(deleteField(field.id))}
                        sx={{
                          flexShrink: 0,
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "error.contrastText",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Add New Field
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Basic" />
              <Tab label="Validation" />
              <Tab label="Derived" />
            </Tabs>
          </Box>

          {/* Basic Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      value={newField.type}
                      label="Field Type"
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          type: e.target.value as FieldType,
                        })
                      }
                    >
                      {fieldTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Field Label"
                    fullWidth
                    size="small"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                  }
                  label="Required field"
                />

                <TextField
                  label="Default Value"
                  fullWidth
                  size="small"
                  value={newField.defaultValue}
                  onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                  placeholder={newField.type === "date" ? "YYYY-MM-DD" : "Enter default value"}
                  helperText={
                    newField.type === "date" ? "For date fields, use format: YYYY-MM-DD (e.g., 1990-01-15)" : ""
                  }
                />

                {(newField.type === "select" || newField.type === "radio") && (
                  <TextField
                    label="Options (one per line)"
                    fullWidth
                    multiline
                    rows={4}
                    value={newField.options.join("\n")}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        options: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Validation Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">Validation Rules</Typography>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Add Validation</InputLabel>
                    <Select
                      value=""
                      label="Add Validation"
                      onChange={(e) => {
                        if (e.target.value) {
                          addValidationRule(e.target.value as ValidationRule["type"])
                        }
                      }}
                    >
                      <MenuItem value="required">Required</MenuItem>
                      <MenuItem value="minLength">Min Length</MenuItem>
                      <MenuItem value="maxLength">Max Length</MenuItem>
                      <MenuItem value="email">Email Format</MenuItem>
                      <MenuItem value="password">Password Rules</MenuItem>
                      <MenuItem value="custom">Custom Rule</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {newField.validations.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No validation rules added yet. Use the dropdown above to add rules.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {newField.validations.map((rule) => (
                      <Accordion key={rule.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                              size="small"
                              color="primary"
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeValidationRule(rule.id)
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            {(rule.type === "minLength" || rule.type === "maxLength" || rule.type === "password") && (
                              <TextField
                                label={rule.type === "password" ? "Minimum Length" : "Length"}
                                type="number"
                                size="small"
                                value={rule.value || ""}
                                onChange={(e) =>
                                  updateValidationRule(rule.id, { value: Number.parseInt(e.target.value) || 0 })
                                }
                                placeholder={rule.type === "password" ? "8" : "0"}
                              />
                            )}

                            {rule.type === "custom" && (
                              <TextField
                                label="Custom Rule (RegEx)"
                                size="small"
                                value={rule.value || ""}
                                onChange={(e) => updateValidationRule(rule.id, { value: e.target.value })}
                                placeholder="^[a-zA-Z0-9]+$"
                              />
                            )}

                            <TextField
                              label="Error Message"
                              size="small"
                              value={rule.message || ""}
                              onChange={(e) => updateValidationRule(rule.id, { message: e.target.value })}
                              placeholder="Enter error message"
                            />
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* Derived Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newField.derived.enabled}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          derived: { ...newField.derived, enabled: e.target.checked },
                        })
                      }
                    />
                  }
                  label="Enable Derived Field"
                />

                {newField.derived.enabled && (
                  <>
                    <FormControl fullWidth size="small">
                      <InputLabel>Computation Type</InputLabel>
                      <Select
                        value={newField.derived.computationType}
                        label="Computation Type"
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            derived: {
                              ...newField.derived,
                              computationType: e.target.value as DerivedField["computationType"],
                              // Reset parent fields when computation type changes
                              parentFields: [],
                            },
                          })
                        }
                      >
                        <MenuItem value="age">Age from Date of Birth</MenuItem>
                        <MenuItem value="sum">Sum of Numbers</MenuItem>
                        <MenuItem value="concat">Concatenate Text</MenuItem>
                        <MenuItem value="custom">Custom Formula</MenuItem>
                      </Select>
                    </FormControl>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Parent Fields
                        {newField.derived.computationType === "age" && (
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                            Select a date field to calculate age from
                          </Typography>
                        )}
                      </Typography>
                      {getAvailableParentFields().length > 0 ? (
                        <FormGroup>
                          {getAvailableParentFields().map((field) => (
                            <FormControlLabel
                              key={field.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={newField.derived.parentFields.includes(field.id)}
                                  onChange={() => toggleParentField(field.id)}
                                  disabled={
                                    newField.derived.computationType === "age" &&
                                    newField.derived.parentFields.length > 0 &&
                                    !newField.derived.parentFields.includes(field.id)
                                  }
                                />
                              }
                              label={`${field.label || `${field.type} field`} ${field.type === "date" ? "(Date)" : ""}`}
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {newField.derived.computationType === "age"
                            ? "No date fields available. Add a date field first to calculate age."
                            : "No fields available. Add some fields first to use as parents."}
                        </Typography>
                      )}
                    </Box>

                    {newField.derived.computationType !== "age" && (
                      <TextField
                        label="Formula/Logic"
                        fullWidth
                        multiline
                        rows={3}
                        value={newField.derived.formula}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            derived: { ...newField.derived, formula: e.target.value },
                          })
                        }
                        placeholder={getFormulaPlaceholder()}
                        helperText="Use parentField1, parentField2, etc. to reference selected parent fields"
                      />
                    )}

                    {newField.derived.computationType === "age" && (
                      <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ color: "info.contrastText" }}>
                          <strong>Age Calculation:</strong> This field will automatically calculate the age based on the
                          selected date of birth field. The age will update in real-time as users enter their birth
                          date.
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddField}>
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={formNameDialog} onClose={() => setFormNameDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Save Form
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Form Name"
            fullWidth
            size="small"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormNameDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveForm}>
            Save Form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
