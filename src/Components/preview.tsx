import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";

export default function Preview() {
  const form = useSelector((state: RootState) => state.form.currentForm);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialVals: Record<string, any> = {};
    form.fields.forEach((f) => {
      initialVals[f.id] =
        f.defaultValue || (f.type === "checkbox" ? false : "");
    });
    setValues(initialVals);
  }, [form]);

  const validateField = (field: any, value: any) => {
    let error = "";
    if (field.required && (value === "" || value === false))
      error = "This field is required";
    if (field.validations?.email && value && !/\S+@\S+\.\S+/.test(value))
      error = "Invalid email";
    if (
      field.validations?.passwordRule &&
      value &&
      (!/\d/.test(value) || value.length < 8)
    )
      error = "Password must be at least 8 characters and contain a number";
    return error;
  };

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const field = form.fields.find((f) => f.id === id);
    if (field) {
      setErrors((prev) => ({ ...prev, [id]: validateField(field, value) }));
    }
  };

  const whiteFieldStyles = {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#bb86fc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bb86fc" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#bb86fc",
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        bgcolor: "#121212",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        px: 2,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "#bb86fc",
          textAlign: "center",
          "@media (max-width:400px)": {
            fontSize: "1.5rem",
          },
        }}
      >
        PREVIEW
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {form.fields.map((field) => {
          switch (field.type) {
            case "text":
            case "number":
            case "date":
              return (
                <TextField
                  key={field.id}
                  type={field.type}
                  label={field.label}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  fullWidth
                  sx={whiteFieldStyles}
                />
              );
            case "textarea":
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  multiline
                  rows={4}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  fullWidth
                  sx={whiteFieldStyles}
                />
              );
            case "checkbox":
              return (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox
                      checked={values[field.id] || false}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                      sx={{
                        color: "#bbb",
                        "&.Mui-checked": {
                          color: "#bb86fc",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#eee" }}>
                      {field.label}
                    </Typography>
                  }
                />
              );
            case "select":
              return (
                <TextField
                  select
                  key={field.id}
                  label={field.label}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  fullWidth
                  sx={whiteFieldStyles}
                >
                  {field.options?.map((opt, i) => (
                    <MenuItem key={i} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              );
            default:
              return null;
          }
        })}
      </Box>
    </Box>
  );
}
