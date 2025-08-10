"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import { useNavigate } from "react-router-dom"
import { Paper, Typography, List, ListItemButton, ListItemText, Box, Divider, Chip, Stack } from "@mui/material"
import { loadForm } from "../store/formslice"

export default function Myforms() {
  const forms = useSelector((state: RootState) => state.form.savedForms)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openForm = (form: any) => {
    // Load the form into current form state
    dispatch(loadForm({ name: form.name, fields: form.fields }))
    navigate("/preview")
  }

  return (
    <Box
      sx={{
        height: "80vh",
        bgcolor: "#121212",
        px: 2,
        fontFamily: "'Poppins', sans-serif",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          px: 2,
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
          Your Saved Forms
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            maxWidth: 600,
            mx: "auto",
            textAlign: "center",
            color: "#ccc",
          }}
        >
          Click on any form to preview and manage your saved forms
        </Typography>
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            bgcolor: "#1e1e1e",
            p: 3,
            boxShadow: "0 4px 20px rgba(187, 134, 252, 0.3)",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <List>
            {forms.length === 0 ? (
              <Typography
                variant="h6"
                sx={{
                  py: 4,
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                }}
              >
                No forms saved yet. Start by creating a new form!
              </Typography>
            ) : (
              forms.map((form, idx) => (
                <Box key={form.id}>
                  <ListItemButton
                    onClick={() => openForm(form)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: "transparent",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        bgcolor: "rgba(187, 134, 252, 0.15)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#bb86fc" }}>
                            {form.name}
                          </Typography>
                          <Chip
                            label={`${form.fields.length} fields`}
                            size="small"
                            sx={{
                              bgcolor: "rgba(187, 134, 252, 0.2)",
                              color: "#bb86fc",
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Stack spacing={1}>
                          <Typography variant="body2" sx={{ color: "#999" }}>
                            Created on {new Date(form.createdAt).toLocaleString()}
                          </Typography>
                          {form.fields.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {form.fields.slice(0, 3).map((field, fieldIdx) => (
                                <Chip
                                  key={fieldIdx}
                                  label={field.label || field.type}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.6rem",
                                    height: "20px",
                                    color: "#ccc",
                                    borderColor: "#555",
                                  }}
                                />
                              ))}
                              {form.fields.length > 3 && (
                                <Chip
                                  label={`+${form.fields.length - 3} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.6rem",
                                    height: "20px",
                                    color: "#999",
                                    borderColor: "#555",
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        </Stack>
                      }
                    />
                  </ListItemButton>
                  {idx < forms.length - 1 && <Divider sx={{ borderColor: "#333", my: 1 }} />}
                </Box>
              ))
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  )
}
