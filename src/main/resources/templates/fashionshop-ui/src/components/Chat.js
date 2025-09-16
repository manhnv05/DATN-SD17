import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box, TextField, Button, Paper, Typography, IconButton, CircularProgress, Tooltip, Avatar, Divider, Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SparkleIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const BOT_AVATAR =
    "https://cdn.jsdelivr.net/gh/manhnv05/assets/gemini-bot.svg";
const USER_AVATAR =
    "https://cdn.jsdelivr.net/gh/manhnv05/assets/user-avatar.svg";

export default function GeminiChatbot({ open = true, onClose }) {
    const [chatLog, setChatLog] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatLog, loading]);

    if (!open) return null;

    const sendMessage = async () => {
        const message = userInput.trim();
        if (!message) return;
        setChatLog(prev => [...prev, { sender: 'Bạn', text: message }]);
        setUserInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/chatbot/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            const newMessages = [{ sender: 'Gemini', text: data.reply }];
            if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                newMessages.push({ sender: 'Gemini', type: 'suggestions', items: data.suggestions });
            }
            setChatLog(prev => [...prev, ...newMessages]);
        } catch (e) {
            setChatLog(prev => [...prev, { sender: 'Gemini', text: 'Lỗi kết nối tới server hoặc Gemini API.' }]);
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) sendMessage();
    };

    return (
        <Paper
            elevation={20}
            sx={{
                position: "fixed",
                right: { xs: 0, md: 40 },
                bottom: { xs: 0, md: 40 },
                width: { xs: "100vw", sm: 390, md: 480 },
                height: { xs: "100vh", sm: 600, md: 650 },
                zIndex: 1600,
                display: "flex",
                flexDirection: "column",
                borderRadius: { xs: 0, sm: 6 },
                boxShadow: "0 16px 48px 0 rgba(32,82,114,.15)",
                overflow: "hidden",
                backdropFilter: "blur(6px)",
                background: "linear-gradient(135deg,#f7faff 0%,#f9f4ff 100%)",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.6,
                    background: "linear-gradient(90deg,#1292ff 0,#c822ff 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopLeftRadius: { xs: 0, sm: 24 },
                    borderTopRightRadius: { xs: 0, sm: 24 },
                    boxShadow: "0 2px 12px -8px #c822ff"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={BOT_AVATAR} sx={{ width: 32, height: 32, bgcolor: "#fff" }} />
                    <Typography variant="subtitle1" fontWeight={700} letterSpacing={1}>
                        Fashionshop Chatbot
                    </Typography>
                </Box>
                {onClose && (
                    <Tooltip title="Đóng chatbot">
                        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {/* Chat log */}
            <Box sx={{
                flex: 1,
                overflowY: "auto",
                p: 2.2,
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                position: "relative"
            }}>
                {chatLog.length === 0 &&
                    <Fade in>
                        <Box sx={{
                            mt: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            color: "#7a7a7a"
                        }}>
                            <Avatar src={BOT_AVATAR} sx={{ width: 56, height: 56, mb: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: 16, textAlign: "center", fontWeight: 500 }}>
                                Hãy bắt đầu trò chuyện với Fashionshop!
                            </Typography>
                        </Box>
                    </Fade>
                }
                {chatLog.map((msg, idx) => (
                    msg.type === 'suggestions' ? (
                        <Box key={idx} sx={{ my: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <SparkleIcon sx={{ color: "#c822ff" }} />
                                <Typography sx={{ fontWeight: 700, color: '#205072', fontSize: 17 }}>
                                    Gợi ý sản phẩm
                                </Typography>
                            </Box>
                            {/* Product suggestions carousel */}
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 2,
                                scrollbarWidth: 'thin',
                                '&::-webkit-scrollbar': { height: 6 },
                                '&::-webkit-scrollbar-thumb': { background: '#e3f0fa', borderRadius: 6 }
                            }}>
                                {msg.items.map((item, i) => (
                                    <Paper key={i}
                                           elevation={3}
                                           sx={{
                                               minWidth: 180,
                                               bgcolor: 'rgba(255,255,255,.97)',
                                               border: '2px solid #e3e3fa',
                                               borderRadius: 4,
                                               boxShadow: "0 2px 18px rgba(32,82,114,.10)",
                                               p: 1.5,
                                               transition: "box-shadow .2s",
                                               ':hover': { boxShadow: "0 6px 24px rgba(32,82,114,.13)" }
                                           }}>
                                        <Box component="img"
                                             src={item.imageUrl || 'https://via.placeholder.com/160x120?text=No+Image'}
                                             alt={item.name}
                                             sx={{
                                                 width: '100%', height: 120, objectFit: 'cover',
                                                 borderRadius: 3, mb: .8, background: '#f7faff'
                                             }} />
                                        <Typography sx={{
                                            fontWeight: 700, fontSize: 15, color: '#205072', mb: .5, minHeight: 36,
                                            display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden'
                                        }}>{item.name}</Typography>
                                        <Typography sx={{
                                            color: '#e53935', fontWeight: 900, fontSize: 16, mb: .5
                                        }}>{item.price ? Number(item.price).toLocaleString('vi-VN') + '₫' : 'Liên hệ'}</Typography>
                                        <Button fullWidth size="small" variant="contained"
                                                sx={{
                                                    bgcolor: "#1292ff", color: "#fff", mt: .5, textTransform: "none",
                                                    fontWeight: 600, fontSize: 13, borderRadius: 2,
                                                    boxShadow: "0 2px 8px rgba(32,82,114,.09)",
                                                    ':hover': { bgcolor: "#0a6bd6" }
                                                }}
                                                href={item.detailPath || (`/shop/detail/${item.id}`)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: msg.sender === 'Bạn' ? 'flex-end' : 'flex-start',
                                mb: 1,
                                position: "relative"
                            }}>
                            {msg.sender !== 'Bạn' &&
                                <Avatar src={BOT_AVATAR} sx={{
                                    width: 30, height: 30, mr: 1, bgcolor: "#fff", border: "2px solid #d7eaff"
                                }} />
                            }
                            <Box sx={{
                                background: msg.sender === 'Bạn'
                                    ? "linear-gradient(90deg,#1292ff 0,#c822ff 100%)"
                                    : "linear-gradient(90deg,#ffffff 0,#f1f8ff 100%)",
                                color: msg.sender === 'Bạn' ? "#fff" : "#222",
                                borderRadius: 8,
                                px: 2,
                                py: 1.5,
                                boxShadow: msg.sender === 'Bạn'
                                    ? "0 2px 12px rgba(32,82,114,.09)"
                                    : "0 1px 6px rgba(32,82,114,.04)",
                                fontSize: 16,
                                maxWidth: { xs: "80vw", sm: "75%" },
                                wordBreak: "break-word",
                                position: "relative"
                            }}>
                                <Typography component="span" sx={{
                                    fontWeight: 600,
                                    color: msg.sender === 'Bạn' ? "#fff" : "#1292ff",
                                    fontSize: 16,
                                    mr: 1
                                }}>{msg.sender}:</Typography>
                                <Typography component="span" sx={{ fontSize: 15 }}>{msg.text}</Typography>
                            </Box>
                            {msg.sender === 'Bạn' &&
                                <Avatar src={USER_AVATAR}
                                        sx={{ width: 30, height: 30, ml: 1, bgcolor: "#fff", border: "2px solid #eaeaea" }} />}
                        </Box>
                    )
                ))}
                {loading && (
                    <Box sx={{
                        color: "#1292ff",
                        fontStyle: "italic",
                        display: "flex",
                        alignItems: "center",
                        gap: 1, mt: 1.5,
                        justifyContent: "center"
                    }}>
                        <CircularProgress size={22} sx={{ color: "#1292ff" }} />
                        <Typography sx={{ fontWeight: 500, fontSize: 16 }}>
                            Gemini đang trả lời...
                        </Typography>
                    </Box>
                )}
                <div ref={chatEndRef}></div>
            </Box>
            <Divider sx={{ bgcolor: "#eaeaea", height: 2 }} />
            {/* Input */}
            <Box sx={{
                px: 2.5, py: 2,
                bgcolor: "#f6f9ff",
                display: "flex",
                gap: 1.5,
                alignItems: "center"
            }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userInput}
                    disabled={loading}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    sx={{
                        bgcolor: "#fff",
                        '.MuiOutlinedInput-root': {
                            borderRadius: 3.5,
                            fontSize: 16,
                        }
                    }}
                    autoFocus
                    InputProps={{
                        startAdornment: (
                            <ChatBubbleOutlineIcon sx={{ color: "#1292ff", mr: 1 }} />
                        )
                    }}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()}
                    endIcon={<SendIcon />}
                    sx={{
                        background: "linear-gradient(90deg,#1292ff 0,#c822ff 100%)",
                        fontWeight: 700,
                        borderRadius: 3.5,
                        minWidth: 52,
                        py: 1.3,
                        px: 2.5,
                        fontSize: 16,
                        boxShadow: "0 2px 10px rgba(32,82,114,.10)",
                        ':hover': { background: "linear-gradient(90deg,#0a6bd6 0,#7c1cc3 100%)" }
                    }}
                >Gửi</Button>
            </Box>
        </Paper>
    );
}

GeminiChatbot.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};