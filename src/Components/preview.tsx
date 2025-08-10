"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  Paper,
  Button,
  Divider,
} from "@mui/material"

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
  computationType: "age" | "sum" | "concat" | "date" | "custom"
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

export default function Preview() {
  const form = useSelector((state: RootState) => state.form.currentForm)
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const initialVals: Record<string, any> = {}
    form.fields.forEach((field) => {
      if (field.derived?.enabled) {
        initialVals[field.id] = ""
      } else {
        initialVals[field.id] = field.defaultValue || (field.type === "checkbox" ? false : "")
      }
    })
    setValues(initialVals)
  }, [form])

  // Update derived fields when parent fields change
  useEffect(() => {
    const newValues = { ...values }
    let hasChanges = false

    form.fields.forEach((field) => {
      if (field.derived?.enabled && field.derived.parentFields.length > 0) {
        const derivedValue = calculateDerivedValue(field, values)
        if (newValues[field.id] !== derivedValue) {
          newValues[field.id] = derivedValue
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      setValues(newValues)
    }
  }, [values, form.fields])

  const calculateDerivedValue = (field: Field, currentValues: Record<string, any>): any => {
    if (!field.derived?.enabled || field.derived.parentFields.length === 0) {
      return ""
    }

    const parentValues = field.derived.parentFields.map((parentId) => currentValues[parentId] || "")

    try {
      switch (field.derived.computationType) {
        case "age":
        case "date":
          if (parentValues[0]) {
            const birthDate = new Date(parentValues[0])

            // Check if the date is valid
            if (isNaN(birthDate.getTime())) {
              return ""
            }

            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()

            // Adjust age if birthday hasn't occurred this year
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--
            }

            // Return age only if it's a reasonable number (0-150)
            return age >= 0 && age <= 150 ? age.toString() : ""
          }
          return ""

        case "sum":
          const sum = parentValues.reduce((acc, val) => {
            const num = Number.parseFloat(val)
            return acc + (isNaN(num) ? 0 : num)
          }, 0)
          return sum.toString()

        case "concat":
          return parentValues.filter(Boolean).join(" ")

        case "custom":
          if (field.derived.formula) {
            // Replace parentField1, parentField2, etc. with actual values
            let formula = field.derived.formula
            parentValues.forEach((value, index) => {
              const placeholder = `parentField${index + 1}`
              formula = formula.replace(new RegExp(placeholder, "g"), `"${value}"`)
            })

            // Basic safety check - only allow simple operations
            if (/^[0-9+\-*/.() "]+$/.test(formula.replace(/"/g, ""))) {
              try {
                return eval(formula).toString()
              } catch {
                return "Error in formula"
              }
            }
          }
          return ""

        default:
          return ""
      }
    } catch (error) {
      return "Calculation error"
    }
  }

  const validateField = (field: Field, value: any): string => {
    // Skip validation for derived fields
    if (field.derived?.enabled) {
      return ""
    }

    for (const rule of field.validations || []) {
      switch (rule.type) {
        case "required":
          if (field.required && (value === "" || value === false || value === null || value === undefined)) {
            return rule.message || "This field is required"
          }
          break

        case "minLength":
          if (value && typeof value === "string" && rule.value && value.length < Number(rule.value)) {
            return rule.message || `Minimum length is ${rule.value} characters`
          }
          break

        case "maxLength":
          if (value && typeof value === "string" && rule.value && value.length > Number(rule.value)) {
            return rule.message || `Maximum length is ${rule.value} characters`
          }
          break

        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message || "Please enter a valid email address"
          }
          break

        case "password":
          if (value) {
            const minLength = Number(rule.value) || 8
            if (value.length < minLength) {
              return rule.message || `Password must be at least ${minLength} characters`
            }
            if (!/\d/.test(value)) {
              return rule.message || "Password must contain at least one number"
            }
          }
          break

        case "custom":
          if (value && rule.value) {
            try {
              const regex = new RegExp(rule.value as string)
              if (!regex.test(value)) {
                return rule.message || "Invalid format"
              }
            } catch {
              return "Invalid validation rule"
            }
          }
          break
      }
    }

    return ""
  }

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }))

    const field = form.fields.find((f) => f.id === id)
    if (field) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [id]: error }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    form.fields.forEach((field) => {
      const error = validateField(field, values[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!")
      console.log("Form Data:", values)
    }
  }

  const whiteFieldStyles = {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#bb86fc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bb86fc" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#bb86fc",
    },
    "& .MuiFormHelperText-root": { color: "#ff6b6b" },
  }

  const renderField = (field: Field) => {
    const isReadOnly = field.derived?.enabled || false
    const fieldValue = values[field.id] || ""
    const fieldError = errors[field.id] || ""

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "password":
        return (
          <Box key={field.id} sx={{ position: "relative", mb: 3 }}>
            <TextField
              type={field.type === "password" ? "password" : field.type}
              label={field.label}
              value={fieldValue}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={!!fieldError}
              helperText={fieldError}
              fullWidth
              required={field.required}
              InputProps={{
                readOnly: isReadOnly,
              }}
              sx={{
                ...whiteFieldStyles,
                ...(isReadOnly && {
                  "& .MuiInputBase-input": {
                    color: "#bb86fc",
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                  },
                }),
              }}
            />
            {isReadOnly && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 8,
                  backgroundColor: "#bb86fc",
                  color: "black",
                  px: 1,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Auto-calculated
              </Typography>
            )}
          </Box>
        )

      case "date":
        return (
          <Box key={field.id} sx={{ position: "relative", mb: 3 }}>
            <TextField
              type="date"
              label={field.label}
              value={fieldValue}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={!!fieldError}
              helperText={fieldError || "Select your date of birth"}
              fullWidth
              required={field.required}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: isReadOnly,
              }}
              sx={{
                ...whiteFieldStyles,
                ...(isReadOnly && {
                  "& .MuiInputBase-input": {
                    color: "#bb86fc",
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                  },
                }),
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)",
                  cursor: "pointer",
                },
              }}
            />
            {isReadOnly && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 8,
                  backgroundColor: "#bb86fc",
                  color: "black",
                  px: 1,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Auto-calculated
              </Typography>
            )}
          </Box>
        )

      case "textarea":
        return (
          <Box key={field.id} sx={{ position: "relative", mb: 3 }}>
            <TextField
              label={field.label}
              multiline
              rows={4}
              value={fieldValue}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={!!fieldError}
              helperText={fieldError}
              fullWidth
              required={field.required}
              InputProps={{
                readOnly: isReadOnly,
              }}
              sx={{
                ...whiteFieldStyles,
                ...(isReadOnly && {
                  "& .MuiInputBase-input": {
                    color: "#bb86fc",
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                  },
                }),
              }}
            />
            {isReadOnly && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 8,
                  backgroundColor: "#bb86fc",
                  color: "black",
                  px: 1,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Auto-calculated
              </Typography>
            )}
          </Box>
        )

      case "checkbox":
        return (
          <Box key={field.id} sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldValue || false}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  disabled={isReadOnly}
                  sx={{
                    color: "#bbb",
                    "&.Mui-checked": {
                      color: "#bb86fc",
                    },
                    "&.Mui-disabled": {
                      color: "#bb86fc",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#eee" }}>
                    {field.label}
                    {field.required && <span style={{ color: "#ff6b6b" }}> *</span>}
                  </Typography>
                  {isReadOnly && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "#bb86fc",
                        color: "black",
                        px: 1,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      Auto-calculated
                    </Typography>
                  )}
                </Box>
              }
            />
            {fieldError && <FormHelperText sx={{ color: "#ff6b6b", ml: 4 }}>{fieldError}</FormHelperText>}
          </Box>
        )

      case "select":
        return (
          <Box key={field.id} sx={{ position: "relative", mb: 3 }}>
            <TextField
              select
              label={field.label}
              value={fieldValue}
              onChange={(e) => handleChange(field.id, e.target.value)}
              error={!!fieldError}
              helperText={fieldError}
              fullWidth
              required={field.required}
              InputProps={{
                readOnly: isReadOnly,
              }}
              sx={{
                ...whiteFieldStyles,
                ...(isReadOnly && {
                  "& .MuiInputBase-input": {
                    color: "#bb86fc",
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                  },
                }),
              }}
            >
              {field.options?.map((opt, i) => (
                <MenuItem key={i} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            {isReadOnly && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 8,
                  backgroundColor: "#bb86fc",
                  color: "black",
                  px: 1,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Auto-calculated
              </Typography>
            )}
          </Box>
        )

      case "radio":
        return (
          <Box key={field.id} sx={{ position: "relative", mb: 3 }}>
            <FormControl component="fieldset" error={!!fieldError}>
              <FormLabel
                component="legend"
                sx={{
                  color: "#eee",
                  "&.Mui-focused": { color: "#bb86fc" },
                  mb: 1,
                }}
              >
                {field.label}
                {field.required && <span style={{ color: "#ff6b6b" }}> *</span>}
              </FormLabel>
              <RadioGroup value={fieldValue} onChange={(e) => handleChange(field.id, e.target.value)}>
                {field.options?.map((opt, i) => (
                  <FormControlLabel
                    key={i}
                    value={opt}
                    disabled={isReadOnly}
                    control={
                      <Radio
                        sx={{
                          color: "#bbb",
                          "&.Mui-checked": { color: "#bb86fc" },
                          "&.Mui-disabled": { color: "#bb86fc" },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: "#eee" }}>{opt}</Typography>}
                  />
                ))}
              </RadioGroup>
              {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
            </FormControl>
            {isReadOnly && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 8,
                  backgroundColor: "#bb86fc",
                  color: "black",
                  px: 1,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Auto-calculated
              </Typography>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        px: 2,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "#bb86fc",
          textAlign: "center",
          "@media (max-width:400px)": {
            fontSize: "1.5rem",
          },
        }}
      >
        {form.name || "Form Preview"}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "#ccc",
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        Fill out the form below. Fields marked with * are required.
      </Typography>

      {form.fields.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 4,
            bgcolor: "#1e1e1e",
            textAlign: "center",
          }}
        >
          <Alert severity="info" sx={{ mb: 2 }}>
            No fields to preview. Go back to the form builder to add some fields.
          </Alert>
        </Paper>
      ) : (
        <Paper
          elevation={8}
          sx={{
            maxWidth: 700,
            width: "100%",
            p: 4,
            bgcolor: "#1e1e1e",
            boxShadow: "0 8px 32px rgba(187, 134, 252, 0.2)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            {form.fields.map(renderField)}

            {/* Submit Section */}
            <Divider sx={{ my: 3, borderColor: "#333" }} />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#bb86fc",
                  color: "black",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#9c27b0",
                  },
                }}
              >
                Submit Form
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => {
                  setValues({})
                  setErrors({})
                  // Reset to default values
                  const initialVals: Record<string, any> = {}
                  form.fields.forEach((field) => {
                    if (field.derived?.enabled) {
                      initialVals[field.id] = ""
                    } else {
                      initialVals[field.id] = field.defaultValue || (field.type === "checkbox" ? false : "")
                    }
                  })
                  setValues(initialVals)
                }}
                sx={{
                  borderColor: "#bb86fc",
                  color: "#bb86fc",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#9c27b0",
                    bgcolor: "rgba(187, 134, 252, 0.1)",
                  },
                }}
              >
                Reset Form
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  )
}
