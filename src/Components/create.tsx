"use client";

import { useState } from "react";
import "../styles/create.css";

import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { RootState } from "../store/store";
import { addField, deleteField, saveForm } from "../store/formslice";
import { v4 as uuidv4 } from "uuid";

const fieldTypes = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
] as const;

type FieldType = (typeof fieldTypes)[number];

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue: string;
  validations: Record<string, any>;
  options: string[];
  derived: null | any;
}

export default function Create() {
  const dispatch = useDispatch();
  const fields = useSelector(
    (state: RootState) => state.form.currentForm.fields
  );
  const [open, setOpen] = useState(false);
  const [formNameDialog, setFormNameDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [newField, setNewField] = useState<Field>({
    id: "",
    type: "text",
    label: "",
    required: false,
    defaultValue: "",
    validations: {},
    options: [],
    derived: null,
  });

  const handleAddField = () => {
    dispatch(addField({ ...newField, id: uuidv4() }));
    setNewField({
      id: "",
      type: "text",
      label: "",
      required: false,
      defaultValue: "",
      validations: {},
      options: [],
      derived: null,
    });
    setOpen(false);
  };

  const handleSaveForm = () => {
    dispatch(saveForm(formName));
    setFormName("");
    setFormNameDialog(false);
    setShowSaveSuccess(true);

    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

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
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 500 }}
              >
                No fields added yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click "Add New Field" to start building your form
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
            >
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
                      height: 140,
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
                          <Typography
                            variant="caption"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                              px: 1,
                              py: 0.25,
                              borderRadius: 0.5,
                              fontSize: "0.7rem",
                            }}
                          >
                            {field.type}
                          </Typography>
                          {field.required && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "error.main",
                                fontWeight: 500,
                                bgcolor: "error.light",
                                px: 1,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: "0.7rem",
                              }}
                            >
                              Required
                            </Typography>
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
                            }}
                          >
                            Default: {field.defaultValue}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Add New Field
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
              placeholder="Enter field label"
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                />
              }
              label="Required field"
            />

            <TextField
              label="Default Value"
              fullWidth
              size="small"
              value={newField.defaultValue}
              onChange={(e) =>
                setNewField({ ...newField, defaultValue: e.target.value })
              }
              placeholder="Enter default value"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddField}>
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={formNameDialog}
        onClose={() => setFormNameDialog(false)}
        maxWidth="sm"
        fullWidth
      >
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
  );
}
