import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import { reorderFields } from "../store/formslice";

export default function Myforms() {
  const forms = useSelector((state: RootState) => state.form.savedForms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openForm = (form: any) => {
    dispatch(reorderFields(form.fields));
    navigate("/preview");
  };

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
        ></Typography>

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
                <Box key={idx}>
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
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#bb86fc" }}
                        >
                          {form.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          Created on {new Date(form.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  {idx < forms.length - 1 && (
                    <Divider sx={{ borderColor: "#333", my: 1 }} />
                  )}
                </Box>
              ))
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
