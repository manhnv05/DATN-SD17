import React from "react";
import { Alert, Snackbar } from "@mui/material";
import PropTypes from "prop-types";

/**
 * Notifications component
 * Hiển thị thông báo thành công, thất bại hoặc cảnh báo cho toàn app.
 *
 * Props:
 * - open: boolean, có hiển thị thông báo không
 * - onClose: function, callback khi đóng thông báo
 * - message: string, nội dung thông báo
 * - severity: "success" | "error" | "warning" | "info"
 * - autoHideDuration: số ms thông báo tự ẩn (mặc định 2500)
 */
function Notifications({
                           open,
                           onClose,
                           message,
                           severity = "info",
                           autoHideDuration = 2500,
                           anchorOrigin = { vertical: "top", horizontal: "center" },
                       }) {
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            anchorOrigin={anchorOrigin}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: "100%",
                    fontWeight: 500,
                    fontSize: 16,
                    letterSpacing: 0.2,
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

Notifications.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    message: PropTypes.node.isRequired,
    severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
    autoHideDuration: PropTypes.number,
    anchorOrigin: PropTypes.object,
};

export default Notifications;