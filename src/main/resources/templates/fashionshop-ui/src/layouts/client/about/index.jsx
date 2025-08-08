import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    Avatar,
    useMediaQuery,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

const teamMembers = [
    {
        name: "Alex Smith",
        position: "Founder & CEO",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Jennifer Doe",
        position: "Creative Director",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Chris Lee",
        position: "Head of Operations",
        img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
        name: "Linda Tran",
        position: "Marketing Lead",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
];

const stats = [
    {
        icon: <EmojiEventsIcon sx={{ fontSize: 38, color: "#ffe600" }} />,
        label: "Awards",
        value: "10+",
    },
    {
        icon: <GroupsIcon sx={{ fontSize: 38, color: "#00bfae" }} />,
        label: "Team Members",
        value: "30+",
    },
    {
        icon: <StorefrontIcon sx={{ fontSize: 38, color: "#ff7043" }} />,
        label: "Stores",
        value: "5",
    },
    {
        icon: <StarIcon sx={{ fontSize: 38, color: "#ffe600" }} />,
        label: "Happy Clients",
        value: "20,000+",
    },
];

export default function AboutPage() {
    const isMobile = useMediaQuery('(max-width:900px)');

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
                        letterSpacing: 1.3,
                        textShadow: "0 3px 15px #fff8",
                        bgcolor: "rgba(255,255,255,0.82)",
                        px: isMobile ? 3 : 7,
                        py: 1.2,
                        borderRadius: 8,
                        border: "1.5px solid #bde0fe"
                    }}
                >
                    About Us
                </Typography>
            </Box>

            {/* Who we are */}
            <Box sx={{
                maxWidth: 1120,
                mx: "auto",
                px: 2,
                mt: 6,
                mb: 8,
            }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                            alt="Who we are"
                            sx={{
                                width: "100%",
                                height: isMobile ? 220 : 340,
                                objectFit: "cover",
                                borderRadius: 8,
                                boxShadow: "0 4px 22px 0 #bde0fe26",
                                border: "1.5px solid #e3f0fa"
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, color: "#205072", letterSpacing: 1.1 }}>
                            Who We Are
                        </Typography>
                        <Typography sx={{ fontSize: 17, color: "#444", mb: 2, lineHeight: 1.7 }}>
                            At <b>COOLMATE</b>, we are passionate about creating stylish, high-quality, and affordable fashion for everyone.
                            Since our founding, we&apos;ve been committed to making a positive impact on our customers, our team, and our community.
                        </Typography>
                        <Typography sx={{ fontSize: 16, color: "#888", lineHeight: 1.7 }}>
                            Our journey started with a simple belief: fashion should be accessible and enjoyable for all.
                            Today, we continue to grow, innovate, and inspire with every collection, every product, and every story we share.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Our values */}
            <Box sx={{ maxWidth: 1120, mx: "auto", px: 2, mb: 8 }}>
                <Paper elevation={0} sx={{
                    p: isMobile ? 2.5 : 4,
                    borderRadius: 6,
                    bgcolor: "#fff",
                    boxShadow: "0 4px 18px 0 #bde0fe22",
                    border: "1.5px solid #e3f0fa"
                }}>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 3, color: "#205072" }}>
                        Our Values
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Stack alignItems="center" spacing={1.5}>
                                <FavoriteIcon sx={{ fontSize: 38, color: "#e53935" }} />
                                <Typography fontWeight={700} sx={{ fontSize: 17.5, color: "#e53935" }}>Passion</Typography>
                                <Typography sx={{ color: "#666", fontSize: 15, textAlign: "center", lineHeight: 1.6 }}>
                                    We put our heart into everything we do, from design to service.
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack alignItems="center" spacing={1.5}>
                                <StarIcon sx={{ fontSize: 38, color: "#ffe600" }} />
                                <Typography fontWeight={700} sx={{ fontSize: 17.5, color: "#ffd600" }}>Quality</Typography>
                                <Typography sx={{ color: "#666", fontSize: 15, textAlign: "center", lineHeight: 1.6 }}>
                                    We are committed to bringing premium quality to every product.
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack alignItems="center" spacing={1.5}>
                                <GroupsIcon sx={{ fontSize: 38, color: "#00bfae" }} />
                                <Typography fontWeight={700} sx={{ fontSize: 17.5, color: "#00bfae" }}>Community</Typography>
                                <Typography sx={{ color: "#666", fontSize: 15, textAlign: "center", lineHeight: 1.6 }}>
                                    We believe in building a supportive, diverse, and inclusive community.
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Our stats */}
            <Box sx={{ maxWidth: 1120, mx: "auto", px: 2, mb: 8 }}>
                <Grid container spacing={3} justifyContent="center">
                    {stats.map((stat, idx) => (
                        <Grid item xs={6} md={3} key={idx}>
                            <Paper elevation={0} sx={{
                                p: isMobile ? 2.2 : 3,
                                borderRadius: 7,
                                bgcolor: "#fffbea",
                                textAlign: "center",
                                boxShadow: "0 4px 16px 0 #ffe60014",
                                border: "1.5px solid #ffe60044"
                            }}>
                                <Box>{stat.icon}</Box>
                                <Typography sx={{ fontWeight: 900, fontSize: 28, color: "#23252c", mt: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography sx={{ color: "#b7a33b", fontSize: 15 }}>{stat.label}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Meet our team */}
            <Box sx={{ maxWidth: 1120, mx: "auto", px: 2, mb: 12 }}>
                <Typography variant="h5" fontWeight={900} sx={{ mb: 3.5, color: "#205072" }}>
                    Meet Our Team
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {teamMembers.map((member, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Paper elevation={0} sx={{
                                p: 3,
                                borderRadius: 7,
                                textAlign: "center",
                                bgcolor: "#fff",
                                boxShadow: "0 4px 14px 0 #bde0fe22",
                                border: "1.5px solid #e3f0fa",
                                transition: "box-shadow 0.2s, transform 0.14s",
                                "&:hover": {
                                    boxShadow: "0 10px 36px 0 #bde0fe44",
                                    transform: "translateY(-4px) scale(1.03)"
                                }
                            }}>
                                <Avatar
                                    src={member.img}
                                    alt={member.name}
                                    sx={{
                                        width: 86,
                                        height: 86,
                                        mx: "auto",
                                        mb: 2,
                                        boxShadow: "0 2px 12px 0 #bde0fe33",
                                        border: "2.5px solid #fffbea"
                                    }}
                                />
                                <Typography sx={{ fontWeight: 700, fontSize: 17.5, color: "#205072" }}>
                                    {member.name}
                                </Typography>
                                <Typography sx={{ color: "#888", fontSize: 15.2 }}>
                                    {member.position}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
}