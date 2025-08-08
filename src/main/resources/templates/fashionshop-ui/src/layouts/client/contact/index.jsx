import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    TextField,
    Button,
    Divider,
    useMediaQuery,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const isMobile = useMediaQuery("(max-width:900px)");

    function handleChange(e) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        // Thực tế sẽ gửi form đi tại đây
    }

    return (
        <Box sx={{ bgcolor: "#f7fafd", minHeight: "100vh" }}>
            <Header />

            {/* Banner */}
            <Box
                sx={{
                    width: "100%",
                    height: isMobile ? 110 : 170,
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    mt: 2,
                    background:
                        "url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80) center/cover",
                    borderRadius: { xs: "0 0 14px 14px", md: "0 0 32px 32px" },
                    boxShadow: "0 6px 32px 0 #bde0fe22"
                }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight={900}
                    sx={{
                        color: "#205072",
                        letterSpacing: 1.2,
                        textShadow: "0 3px 15px #fff9",
                        bgcolor: "rgba(255,255,255,0.82)",
                        px: isMobile ? 3 : 7,
                        py: 1.2,
                        borderRadius: 8,
                        border: "1.5px solid #bde0fe"
                    }}
                >
                    Contact
                </Typography>
            </Box>

            {/* Contact Content */}
            <Box
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    px: 2,
                    mt: 2,
                    mb: 7,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={900}
                    sx={{ mb: 1.5, color: "#205072", letterSpacing: 1.1 }}
                >
                    Get in Touch With Us
                </Typography>
                <Typography sx={{ color: "#888", mb: 5, fontSize: 16 }}>
                    We are here to answer any question you may have. Reach out to us and we&apos;ll respond as soon as we can.
                </Typography>
                <Grid container spacing={5} justifyContent="center" alignItems="flex-start">
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: isMobile ? 2 : 3,
                                borderRadius: 6,
                                bgcolor: "#fff",
                                boxShadow: "0 4px 18px 0 #bde0fe22",
                                mb: { xs: 3, md: 0 },
                                border: "1.5px solid #e3f0fa"
                            }}
                        >
                            <Stack spacing={3} alignItems="flex-start">
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <LocationOnIcon sx={{ fontSize: 28, color: "#ffb300", mt: 0.5 }} />
                                    <Box textAlign="left">
                                        <Typography sx={{ fontWeight: 700, fontSize: 16.5, color: "#205072" }}>Address</Typography>
                                        <Typography sx={{ color: "#666", fontSize: 15.2, mt: 0.3 }}>
                                            1234 Main Street<br />Hanoi, Vietnam
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <PhoneIcon sx={{ fontSize: 26, color: "#43a047", mt: 0.3 }} />
                                    <Box textAlign="left">
                                        <Typography sx={{ fontWeight: 700, fontSize: 16.5, color: "#205072" }}>Phone</Typography>
                                        <Typography sx={{ color: "#666", fontSize: 15.2, mt: 0.3 }}>
                                            (+84) 357 420 420
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <AccessTimeIcon sx={{ fontSize: 25, color: "#1976d2", mt: 0.2 }} />
                                    <Box textAlign="left">
                                        <Typography sx={{ fontWeight: 700, fontSize: 16.5, color: "#205072" }}>Working Time</Typography>
                                        <Typography sx={{ color: "#666", fontSize: 15.2, mt: 0.3 }}>
                                            8:00 - 20:00 (Mon - Sat)
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 4 },
                                borderRadius: 6,
                                boxShadow: "0 4px 18px 0 #bde0fe22",
                                bgcolor: "#fff",
                                textAlign: "left",
                                border: "1.5px solid #e3f0fa"
                            }}
                        >
                            {submitted ? (
                                <Typography sx={{ color: "#388e3c", fontWeight: 700, fontSize: 17.5 }}>
                                    Thank you! Your message has been sent.
                                </Typography>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                size="small"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                size="small"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Subject"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                size="small"
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Message"
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                size="small"
                                                fullWidth
                                                required
                                                multiline
                                                rows={4}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            bgcolor: "#1976d2",
                                            color: "#fff",
                                            fontWeight: 800,
                                            fontSize: 16.5,
                                            px: 5,
                                            borderRadius: 2.5,
                                            textTransform: "none",
                                            boxShadow: "0 2px 8px 0 #1976d233",
                                            "&:hover": { bgcolor: "#205072" },
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
}