import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    useMediaQuery,
} from "@mui/material";

// Dữ liệu bài viết blog mẫu
const blogPosts = [
    {
        id: 1,
        title: "Theo đuổi thiết kế tối giản toàn diện",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        date: "08 Tháng 08, 2025",
        author: "Alex Smith",
        excerpt: "Khám phá cách thiết kế tối giản có thể biến không gian làm việc của bạn trở nên bình yên và hiệu quả. Đơn giản là đỉnh cao của sự tinh tế.",
    },
    {
        id: 2,
        title: "Khám phá những cách trang trí mới",
        image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80",
        date: "01 Tháng 08, 2025",
        author: "Jennifer Doe",
        excerpt: "Từ vật liệu bền vững đến bố trí thông minh, cùng xem các xu hướng trang trí nhà mới nhất mang lại sự thoải mái và phong cách cho không gian sống.",
    },
    {
        id: 3,
        title: "Đồ thủ công mất nhiều thời gian chế tác",
        image: "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=600&q=80",
        date: "25 Tháng 07, 2025",
        author: "Chris Lee",
        excerpt: "Trân trọng nghệ thuật thủ công qua những món đồ thủ công độc đáo, ý nghĩa và được làm tỉ mỉ từng chi tiết.",
    },
];

// Danh mục blog mẫu
const blogCategories = [
    "Tối giản",
    "Trang trí",
    "Thủ công",
    "Không gian làm việc",
    "Truyền cảm hứng",
];

// Bài viết gần đây (dùng lại ảnh trên)
const recentPosts = [
    {
        id: 1,
        title: "Theo đuổi thiết kế tối giản toàn diện",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=80&q=80",
        date: "08 Tháng 08, 2025",
    },
    {
        id: 2,
        title: "Khám phá những cách trang trí mới",
        image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=80&q=80",
        date: "01 Tháng 08, 2025",
    },
    {
        id: 3,
        title: "Đồ thủ công mất nhiều thời gian chế tác",
        image: "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=80&q=80",
        date: "25 Tháng 07, 2025",
    },
];

export default function BlogPage() {
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
                    background: "url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80) center/cover",
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
                    Blog
                </Typography>
            </Box>

            {/* Nội dung */}
            <Box sx={{
                maxWidth: 1260,
                mx: "auto",
                px: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                mb: 7
            }}>
                {/* Danh sách bài viết */}
                <Box sx={{ flex: 1 }}>
                    {blogPosts.map((post) => (
                        <Paper
                            key={post.id}
                            elevation={4}
                            sx={{
                                mb: 5,
                                p: 0,
                                bgcolor: "#fff",
                                borderRadius: 7,
                                boxShadow: "0 6px 28px 0 #bde0fe22",
                                overflow: "hidden",
                                border: "1.5px solid #e3f0fa"
                            }}
                        >
                            <Box
                                component="img"
                                src={post.image}
                                alt={post.title}
                                sx={{
                                    width: "100%",
                                    height: isMobile ? 180 : 260,
                                    objectFit: "cover",
                                    display: "block",
                                    borderBottom: "1.5px solid #e3f0fa"
                                }}
                            />
                            <Box sx={{ px: isMobile ? 2 : 3, py: isMobile ? 2 : 3 }}>
                                <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
                                    <Typography sx={{ fontSize: 13.5, color: "#888" }}>{post.date}</Typography>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 1.2, borderColor: "#e3f0fa" }} />
                                    <Typography sx={{ fontSize: 13.5, color: "#888" }}>bởi {post.author}</Typography>
                                </Stack>
                                <Typography variant="h5" fontWeight={900} sx={{ mb: 1.3, color: "#205072", letterSpacing: 0.7 }}>
                                    {post.title}
                                </Typography>
                                <Typography sx={{ fontSize: 15.7, color: "#444", mb: 1.3, lineHeight: 1.8 }}>
                                    {post.excerpt}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#1976d2",
                                        fontWeight: 700,
                                        fontSize: 15.5,
                                        cursor: "pointer",
                                        "&:hover": { textDecoration: "underline" }
                                    }}
                                >
                                    Đọc tiếp
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
                {/* Thanh bên phải */}
                <Box sx={{
                    width: { xs: "100%", md: 290 },
                    flexShrink: 0,
                    mt: { xs: 0, md: 1 }
                }}>
                    <Paper elevation={0} sx={{
                        p: isMobile ? 2 : 3,
                        borderRadius: 7,
                        mb: 3,
                        bgcolor: "#fff",
                        boxShadow: "0 4px 18px 0 #bde0fe22",
                        border: "1.5px solid #e3f0fa"
                    }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2, color: "#205072" }}>Danh mục</Typography>
                        <List dense sx={{ pl: 0 }}>
                            {blogCategories.map((cat, idx) => (
                                <ListItem key={cat} sx={{ pl: 0, py: 0.7 }}>
                                    <ListItemButton sx={{
                                        pl: 0,
                                        borderRadius: 2,
                                        "&:hover": { bgcolor: "#e3f0fa" }
                                    }}>
                                        <ListItemText
                                            primary={cat}
                                            primaryTypographyProps={{
                                                sx: { fontSize: 15.5, color: "#205072", fontWeight: 600, letterSpacing: 0.2 }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Paper elevation={0} sx={{
                        p: isMobile ? 2 : 3,
                        borderRadius: 7,
                        bgcolor: "#fff",
                        boxShadow: "0 4px 18px 0 #bde0fe22",
                        border: "1.5px solid #e3f0fa"
                    }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 2, color: "#205072" }}>Bài viết mới</Typography>
                        <List dense sx={{ pl: 0 }}>
                            {recentPosts.map((post) => (
                                <ListItem key={post.id} alignItems="flex-start" sx={{ pl: 0, py: 1.2 }}>
                                    <Box
                                        component="img"
                                        src={post.image}
                                        alt={post.title}
                                        sx={{
                                            width: 56,
                                            height: 44,
                                            objectFit: "cover",
                                            borderRadius: 2,
                                            mr: 1.6,
                                            boxShadow: "0 2px 6px 0 #bde0fe44",
                                            border: "1.5px solid #e3f0fa"
                                        }}
                                    />
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 700, fontSize: 14.2, color: "#191b23",
                                            mb: 0.2, maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                        }}>
                                            {post.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12.5, color: "#888" }}>{post.date}</Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}