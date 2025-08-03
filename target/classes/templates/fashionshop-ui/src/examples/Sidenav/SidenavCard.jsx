import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";

// Soft UI Dashboard React components
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom styles for the SidenavCard
import { card, cardContent, cardIconBox, cardIcon } from "examples/Sidenav/styles/sidenavCard";

// Soft UI Dashboard React context
import { useSoftUIController } from "context";

function SidenavCard() {
  const [controller] = useSoftUIController();
  const { miniSidenav, sidenavColor } = controller;

  return (
      <Card sx={(theme) => ({ ...card(theme, { miniSidenav }), userSelect: "none" })}>
        <CardContent sx={(theme) => ({ ...cardContent(theme, { sidenavColor }), userSelect: "none" })}>
          <SoftBox
              bgColor="white"
              width="2rem"
              height="2rem"
              borderRadius="md"
              shadow="md"
              mb={2}
              sx={{ ...cardIconBox, userSelect: "none" }}
          >
            <Icon fontSize="medium" sx={(theme) => ({ ...cardIcon(theme, { sidenavColor }), userSelect: "none" })}>
              star
            </Icon>
          </SoftBox>
          <SoftBox lineHeight={1} sx={{ userSelect: "none" }}>
            <SoftTypography variant="h6" color="white" sx={{ userSelect: "none" }}>
              Need help?
            </SoftTypography>
            <SoftBox mb={1.825} mt={-1} sx={{ userSelect: "none" }}>
              <SoftTypography variant="caption" color="white" fontWeight="medium" sx={{ userSelect: "none" }}>
                Please check our docs
              </SoftTypography>
            </SoftBox>
            <SoftButton
                component={Link}
                href="https://www.creative-tim.com/learning-lab/react/quick-start/soft-ui-dashboard/"
                target="_blank"
                rel="noreferrer"
                size="small"
                color="white"
                fullWidth
                sx={{ userSelect: "none" }}
            >
              documentation
            </SoftButton>
          </SoftBox>
        </CardContent>
      </Card>
  );
}

export default SidenavCard;