import SoftButton from "../../../../../components/SoftButton";
import SoftBox from "../../../../../components/SoftBox";
import { IconButton } from "@mui/material";
import { Google } from "@mui/icons-material";

function Socials() {
  return (
      <SoftBox display="flex" justifyContent="center" gap={1.5}>
        {/* Facebook */}
        <SoftButton variant="outlined" color="light">
            {/* Facebook SVG - icon trắng */}
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#1877f3" />
              <path
                  d="M21 10.5h-3v-1.25c0-.41.34-.75.75-.75h2.25v-3H18c-1.8 0-3.25 1.45-3.25 3.25V10.5H12v3h2.75V24h3.5v-10.5h2.25l.5-3z"
                  fill="#fff"
              />
            </svg>
        </SoftButton>
        {/* X (Twitter/X) */}
        <SoftButton variant="outlined" color="light">
            {/* X logo SVG */}
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#000" />
              <path
                  d="M22.48 8.13h-2.02l-4.16 5.21-4.16-5.21h-2.02l5.34 7.09-5.61 7.48h2.01l4.45-5.62 4.45 5.62h2.01l-5.61-7.48 5.34-7.09z"
                  fill="#fff"
              />
            </svg>
        </SoftButton>
        {/* Google */}
        <SoftButton variant="outlined" color="light">
            <Google style={{ color: "#EA4335", fontSize: 26 }} />
        </SoftButton>
      </SoftBox>
  );
}

export default Socials;