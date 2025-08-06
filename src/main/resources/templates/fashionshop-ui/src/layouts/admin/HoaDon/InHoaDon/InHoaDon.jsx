import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Component hiển thị modal xem PDF hóa đơn bằng Material UI
 * @param {Object} props
 * @param {boolean} props.isOpen - Hiển thị modal hay không
 * @param {function} props.onClose - Hàm đóng modal
 * @param {string|number} props.hoaDonId - ID hóa đơn để xem PDF
 */
function InHoaDon({ isOpen, onClose, hoaDonId }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý fetch PDF mỗi khi mở modal và có hoaDonId
  useEffect(() => {
    let isMounted = true; // Để tránh update state khi unmount
    let currentPdfUrl = null;

    if (isOpen && hoaDonId) {
      setIsLoading(true);
      setError(null);

      const fetchPdf = async () => {
        try {
          const apiUrl = `http://localhost:8080/api/hoa-don/${hoaDonId}/pdf`;
          const response = await fetch(apiUrl, { credentials: "include" });
          if (!response.ok) throw new Error("Không thể tải hóa đơn.");

          const pdfBlob = await response.blob();
          currentPdfUrl = URL.createObjectURL(pdfBlob);
          if (isMounted) setPdfUrl(currentPdfUrl);
        } catch (err) {
          if (isMounted) setError(err.message || "Lỗi không xác định");
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      fetchPdf();
    }

    // Cleanup khi đóng modal hoặc đổi id
    return () => {
      isMounted = false;
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      if (currentPdfUrl && currentPdfUrl !== pdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hoaDonId]);

  return (
      <Dialog
          open={isOpen}
          onClose={onClose}
          fullWidth
          maxWidth="lg"
          aria-labelledby="pdf-viewer-dialog-title"
          scroll="paper"
      >
        <DialogTitle id="pdf-viewer-dialog-title" sx={{ fontWeight: 700, fontSize: 20 }}>
          Hóa đơn chi tiết
          <IconButton
              aria-label="Đóng"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
              size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
            dividers
            sx={{
              height: { xs: "70vh", md: "80vh" },
              p: 0,
              backgroundColor: "#f9f9f9"
            }}
        >
          {isLoading && (
              <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 320,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
              >
                <CircularProgress size={42} />
              </Box>
          )}
          {!isLoading && error && (
              <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 320,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#d32f2f",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
              >
                Lỗi: {error}
              </Box>
          )}
          {!isLoading && pdfUrl && !error && (
              <iframe
                  src={pdfUrl}
                  title={`Hóa đơn ${hoaDonId}`}
                  width="100%"
                  height="100%"
                  style={{
                    minHeight: 400,
                    border: "none",
                    background: "#fafafa"
                  }}
                  allow="autoplay"
              />
          )}
        </DialogContent>
      </Dialog>
  );
}

InHoaDon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hoaDonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default InHoaDon;