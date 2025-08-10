import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Create from "./Components/create";
import Preview from "./Components/preview";
import Myforms from "./Components/myforms";

export default function App() {
  return (
    <Router>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "purple",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.25rem",
              textTransform: "uppercase",

              "@media (max-width:400px)": {
                fontSize: "0.7rem",
              },
            }}
          >
            upliance.ai Form Builder
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {["create", "preview", "myforms"].map((route) => (
              <Button
                key={route}
                color="inherit"
                component={Link}
                to={`/${route === "create" ? "create" : route}`}
                variant="outlined"
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1rem",
                  padding: "6px 16px",
                  minWidth: 100,
                  "&:hover": {
                    borderColor: "#ddd",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "@media (max-width:400px)": {
                    fontSize: "0.5rem",
                    padding: "4px 8px",
                    minWidth: "auto",
                  },
                }}
              >
                {route === "myforms"
                  ? "My Forms"
                  : route.charAt(0).toUpperCase() + route.slice(1)}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, fontFamily: "Poppins, sans-serif" }}>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/create" element={<Create />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/myforms" element={<Myforms />} />
        </Routes>
      </Container>
    </Router>
  );
}
