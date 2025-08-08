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
                height: { xs: 260, sm: 340, md: 420 },
                position: "relative",
                overflow: "hidden",
                borderRadius: 18,
                boxShadow: "0 8px 32px 0 rgba(32,80,114,0.11)",
                mb: 3,
                userSelect: "none",
                background: "#e9f5fc",
            }}
        >
            {/* Ảnh nền cover (không bo góc, luôn sát mép) */}
            <Box
                component="img"
                src={slides[active].img}
                alt={slides[active].title}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 1,
                    filter: "brightness(0.97) blur(0.5px)",
                    pointerEvents: "none"
                }}
            />

            {/* Slides Overlay */}
            {slides.map((slide, idx) => (
                <Fade in={active === idx} key={idx} timeout={900} unmountOnExit>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 2,
                        }}
                    >
                        {/* Overlay gradient */}
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 2,
                                "&:after": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    left: 0,
                                    top: 0,
                                    zIndex: 2,
                                    background: "linear-gradient(90deg, rgba(32,80,114,.52) 0%, rgba(32,80,114,0.14) 70%, rgba(255,255,255,0.00) 100%)"
                                }
                            }}
                        />
                        {/* Overlay text */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: { xs: 32, md: 56 },
                                left: { xs: 32, md: 70 },
                                color: "#fff",
                                zIndex: 4,
                                maxWidth: { xs: "87%", sm: "54%", md: "38%" },
                                textShadow: "2px 6px 32px rgba(0,0,0,0.32)",
                                background: { xs: "rgba(32,80,114,0.13)", sm: "none" },
                                borderRadius: 3,
                                px: { xs: 2, sm: 0 },
                                py: { xs: 1, sm: 0 }
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "'Pacifico', cursive",
                                    fontWeight: 800,
                                    fontSize: { xs: 28, sm: 44, md: 54 },
                                    lineHeight: 1.08,
                                    color: slide.mainColor,
                                    mb: 1,
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
                                    bgcolor: "rgba(32,80,114,0.16)",
                                    px: 1.3,
                                    borderRadius: 2,
                                    boxShadow: "0 1px 6px 0 rgba(0,0,0,0.09)"
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
                                    background: "rgba(32,80,114,0.16)",
                                    px: 1.2,
                                    py: 0.4,
                                    borderRadius: 1,
                                    fontWeight: 700,
                                    letterSpacing: 0.6,
                                    fontSize: 14
                                }}>{slide.date}</Typography>
                            </Stack>
                        </Box>
                        {/* Bottom caption (centered, bo tròn nhiều, không sát mép) */}
                        <Typography
                            align="center"
                            sx={{
                                position: "absolute",
                                left: "50%",
                                bottom: 20,
                                transform: "translateX(-50%)",
                                color: "#205072",
                                fontSize: 15.2,
                                fontWeight: 600,
                                letterSpacing: 0.4,
                                px: 3,
                                py: 0.7,
                                borderRadius: 999,
                                zIndex: 6,
                                minWidth: 220,
                                maxWidth: { xs: "80vw", md: 430 },
                                boxShadow: "0 2px 12px 0 #bde0fe55",
                                border: "1.5px solid #bde0fe",
                                background: "rgba(255,255,255,0.98)"
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
                    left: 22,
                    transform: "translateY(-50%)",
                    bgcolor: "#fff",
                    "&:hover": { bgcolor: "#e3f0fa" },
                    zIndex: 12,
                    boxShadow: "0 2px 10px 0 #bde0fe55",
                    border: "2px solid #bde0fe",
                    width: 50, height: 50
                }}
                size="large"
            >
                <ArrowBackIos sx={{ color: "#1976d2", fontSize: 28 }} />
            </IconButton>
            <IconButton
                onClick={handleNext}
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: 22,
                    transform: "translateY(-50%)",
                    bgcolor: "#fff",
                    "&:hover": { bgcolor: "#e3f0fa" },
                    zIndex: 12,
                    boxShadow: "0 2px 10px 0 #bde0fe55",
                    border: "2px solid #bde0fe",
                    width: 50, height: 50
                }}
                size="large"
            >
                <ArrowForwardIos sx={{ color: "#1976d2", fontSize: 28 }} />
            </IconButton>
            {/* Dots */}
            <Stack direction="row" spacing={1.15} sx={{
                position: "absolute",
                left: "50%",
                bottom: 38,
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
                            bgcolor: active === idx ? "#1976d2" : "#fff",
                            opacity: 0.97,
                            borderRadius: 5,
                            cursor: "pointer",
                            boxShadow: active === idx ? "0 2px 10px 0 #bde0fe99" : "0 1px 6px 0 #bde0fe33",
                            border: active === idx ? "2px solid #1976d2" : "1.5px solid #bde0fe",
                            transition: "all 0.22s"
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
}