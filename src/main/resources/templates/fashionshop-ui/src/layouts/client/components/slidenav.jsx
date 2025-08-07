import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Stack, IconButton, Fade } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

// Array of slide data
const slides = [
    {
        img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
        title: "The Future is Bright",
        tagline: "SWE SUMMER COLLECTION",
        desc: "\"THE FUTURE IS BRIGHT AND SO IS THE FIRE FROM O' CANVAS\"",
        date: "Date: 5th - April 2025",
        caption: "Mã khuyến mãi: SUMMER25",
        brand: "SWE",
        mainColor: "#ffe600"
    },
    {
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
        title: "Urban Cool",
        tagline: "URBAN STYLE 2025",
        desc: "\"Cá tính - Chất riêng - Đường phố\"",
        date: "Date: 20th - May 2025",
        caption: "Giảm 10% cho đơn đầu tiên!",
        brand: "SWE",
        mainColor: "#00e0b6"
    },
    {
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
        title: "Feel The Freedom",
        tagline: "FREEDOM COLLECTION",
        desc: "Đơn giản, tinh tế, tự do thể hiện cá tính.",
        date: "Date: 10th - July 2025",
        caption: "FREEDOM giảm 5% toàn bộ sản phẩm!",
        brand: "SWE",
        mainColor: "#ff8b60"
    },
];

const SLIDE_INTERVAL = 5000; // 5s

export default function Slidenav() {
    const [active, setActive] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            handleNext();
        }, SLIDE_INTERVAL);
        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line
    }, [active]);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: { xs: 250, sm: 340, md: 400 },
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.11)",
                mb: 3,
                userSelect: "none"
            }}
        >
            {/* Slides */}
            {slides.map((slide, idx) => (
                <Fade in={active === idx} key={idx} timeout={900} unmountOnExit>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    >
                        {/* Background Image + Overlay */}
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                "&:after": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    left: 0,
                                    top: 0,
                                    zIndex: 2,
                                    background: "linear-gradient(90deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,0.18) 70%, rgba(255,255,255,0.01) 100%)"
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={slide.img}
                                alt={slide.title}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    filter: "brightness(0.97) blur(0.5px)",
                                    zIndex: 1,
                                }}
                            />
                        </Box>
                        {/* Overlay text */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: { xs: 24, md: 48 },
                                left: { xs: 22, md: 62 },
                                color: "#fff",
                                zIndex: 3,
                                maxWidth: { xs: "78%", sm: "55%", md: "38%" },
                                textShadow: "2px 6px 32px rgba(0,0,0,0.32)",
                                background: { xs: "rgba(0,0,0,0.18)", sm: "none" },
                                borderRadius: 2,
                                px: { xs: 1, sm: 0 },
                                py: { xs: 0.5, sm: 0 }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "'Pacifico', cursive",
                                    fontWeight: 800,
                                    fontSize: { xs: 28, sm: 46, md: 54 },
                                    lineHeight: 1.08,
                                    color: slide.mainColor,
                                    mb: 0.8,
                                    letterSpacing: 1.5,
                                    filter: "drop-shadow(0 3px 8px #fff1)"
                                }}
                            >
                                {slide.title}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                <Typography sx={{ fontWeight: 900, color: slide.mainColor, fontSize: 19, letterSpacing: 1 }}>
                                    {slide.brand}
                                </Typography>
                                <Typography sx={{
                                    color: "#fff",
                                    fontWeight: 500,
                                    fontSize: 17,
                                    letterSpacing: 0.7,
                                    textTransform: "uppercase",
                                    bgcolor: "rgba(0,0,0,0.13)",
                                    px: 1.3,
                                    borderRadius: 2,
                                    boxShadow: "0 1px 6px 0 rgba(0,0,0,0.10)"
                                }}>
                                    {slide.tagline}
                                </Typography>
                            </Stack>
                            <Typography sx={{
                                color: slide.mainColor,
                                fontWeight: 500,
                                fontSize: 15,
                                mb: 1,
                                fontStyle: "italic",
                                letterSpacing: 0.6,
                                bgcolor: "rgba(255,255,255,0.09)",
                                borderRadius: 1,
                                px: 1
                            }}>
                                {slide.desc}
                            </Typography>
                            <Stack direction="row" spacing={3} sx={{ fontSize: 13 }}>
                                <Typography color="#fff" sx={{
                                    background: "rgba(0,0,0,0.17)",
                                    px: 1.2,
                                    py: 0.4,
                                    borderRadius: 1,
                                    fontWeight: 700,
                                    letterSpacing: 0.6,
                                    fontSize: 14
                                }}>{slide.date}</Typography>
                            </Stack>
                        </Box>
                        {/* Bottom caption */}
                        <Typography
                            align="center"
                            sx={{
                                position: "absolute",
                                width: "100%",
                                left: 0,
                                bottom: 10,
                                color: "#222",
                                fontSize: 15,
                                fontWeight: 600,
                                letterSpacing: 0.4,
                                background: "linear-gradient(90deg,rgba(255,255,255,0.82) 60%,rgba(255,255,255,0.68) 100%)",
                                py: 0.7,
                                borderRadius: 2,
                                zIndex: 3,
                                boxShadow: "0 3px 14px 0 rgba(0,0,0,0.04)"
                            }}
                        >
                            {slide.caption}
                        </Typography>
                    </Box>
                </Fade>
            ))}

            {/* Navigation buttons */}
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: { xs: 8, sm: 24 },
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.84)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    zIndex: 12,
                    boxShadow: "0 2px 10px 0 rgba(0,0,0,0.14)",
                    border: "1.5px solid #ffe600",
                    width: 46, height: 46
                }}
                size="large"
            >
                <ArrowBackIos sx={{ color: "#222", fontSize: 28 }} />
            </IconButton>
            <IconButton
                onClick={handleNext}
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: { xs: 8, sm: 24 },
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.84)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    zIndex: 12,
                    boxShadow: "0 2px 10px 0 rgba(0,0,0,0.14)",
                    border: "1.5px solid #ffe600",
                    width: 46, height: 46
                }}
                size="large"
            >
                <ArrowForwardIos sx={{ color: "#222", fontSize: 28 }} />
            </IconButton>
            {/* Dots */}
            <Stack direction="row" spacing={1.1} sx={{
                position: "absolute",
                left: "50%",
                bottom: 26,
                transform: "translateX(-50%)",
                zIndex: 20
            }}>
                {slides.map((_, idx) => (
                    <Box
                        key={idx}
                        onClick={() => setActive(idx)}
                        sx={{
                            width: active === idx ? 28 : 14,
                            height: 10,
                            bgcolor: active === idx ? "#ffe600" : "#fff",
                            opacity: 0.94,
                            borderRadius: 5,
                            cursor: "pointer",
                            boxShadow: active === idx ? "0 2px 10px 0 #ffe60099" : "0 1px 6px 0 rgba(0,0,0,0.13)",
                            border: active === idx ? "2px solid #ffe600" : "1.5px solid #eee",
                            transition: "all 0.25s"
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
}