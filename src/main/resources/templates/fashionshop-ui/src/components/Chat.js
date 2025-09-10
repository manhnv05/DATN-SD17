import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Thêm dòng này
import { Box, TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function GeminiChatbot({ open = true, onClose }) {
    const [chatLog, setChatLog] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatLog]);

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
            setChatLog(prev => [...prev, { sender: 'Gemini', text: data.reply }]);
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
            elevation={10}
            sx={{
                position: "fixed",
                right: { xs: 0, md: 40 },
                bottom: { xs: 0, md: 40 },
                width: { xs: "100vw", sm: 350, md: 400 },
                height: { xs: "100vh", sm: 520 },
                zIndex: 1500,
                display: "flex",
                flexDirection: "column",
                borderRadius: { xs: 0, sm: 4 },
                boxShadow: 6,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    background: "linear-gradient(90deg,#1292ff 0,#c822ff 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopLeftRadius: { xs: 0, sm: 16 },
                    borderTopRightRadius: { xs: 0, sm: 16 },
                }}
            >
                <Typography variant="subtitle1" fontWeight={700}>Gemini Chatbot</Typography>
                {onClose && (
                    <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            {/* Chat log */}
            <Box sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                bgcolor: "#f7faff",
                display: "flex",
                flexDirection: "column"
            }}>
                {chatLog.length === 0 &&
                    <Typography variant="body2" sx={{ color: "#999", mt: 8, textAlign: "center" }}>
                        Hãy bắt đầu trò chuyện với Gemini!
                    </Typography>
                }
                {chatLog.map((msg, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            alignSelf: msg.sender === 'Bạn' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'Bạn'
                                ? "linear-gradient(90deg,#1292ff 0,#6dc7ff 100%)"
                                : "#fff",
                            color: msg.sender === 'Bạn' ? "#fff" : "#222",
                            borderRadius: 3,
                            px: 2,
                            py: 1,
                            my: 0.5,
                            maxWidth: "85%",
                            boxShadow: msg.sender === 'Bạn' ? 2 : 1,
                            fontSize: 15,
                            whiteSpace: "pre-wrap"
                        }}>
                        <b style={{ fontWeight: 600 }}>{msg.sender}: </b>{msg.text}
                    </Box>
                ))}
                {loading && <Box sx={{ color: "#1292ff", fontStyle: "italic", mt: 1 }}>Gemini đang trả lời...</Box>}
                <div ref={chatEndRef}></div>
            </Box>
            {/* Input */}
            <Box sx={{
                p: 2,
                borderTop: "1px solid #eee",
                bgcolor: "#fff",
                display: "flex",
                gap: 1,
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
                    sx={{ bgcolor: "#f4f7fa" }}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()}
                    sx={{
                        background: "linear-gradient(90deg,#1292ff 0,#c822ff 100%)",
                        fontWeight: 600
                    }}
                >Gửi</Button>
            </Box>
        </Paper>
    );
}

// Bổ sung phần này ở cuối file:
GeminiChatbot.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};