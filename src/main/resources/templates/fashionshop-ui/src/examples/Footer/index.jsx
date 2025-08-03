
import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

function Footer({ company, links }) {
  // Đảm bảo company và links luôn có giá trị hợp lệ
  const safeCompany = company && typeof company === "object" ? company : { href: "", name: "" };
  const safeLinks = Array.isArray(links) ? links : [];
  const { href, name } = safeCompany;
  const { size } = typography;

  const renderLinks = () =>
    safeLinks.map((link) =>
      link && link.name && link.href ? (
        <SoftBox key={link.name} component="li" px={2} lineHeight={1}>
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {link.name}
            </SoftTypography>
          </Link>
        </SoftBox>
      ) : null
    );

  return (
    <SoftBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
    >
      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}, made with
        <SoftBox fontSize={size.md} color="text" mb={-0.5} mx={0.25}>
          <Icon color="inherit" fontSize="inherit">
            favorite
          </Icon>
        </SoftBox>
        by
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <SoftTypography variant="button" fontWeight="medium">
            &nbsp;{name}&nbsp;
          </SoftTypography>
        </Link>
        for a better web.
      </SoftBox>
      <SoftBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {renderLinks()}
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of Footer
Footer.defaultProps = {
  company: { href: "#", name: "FashionShop" },
  links: [
    { href: "#", name: "FashionShop" },
    { href: "#", name: "About Us" },
    { href: "#", name: "Blog" },
    { href: "#", name: "License" },
  ],
};

// Typechecking props for the Footer
Footer.propTypes = {
  company: PropTypes.shape({
    href: PropTypes.string,
    name: PropTypes.string,
  }),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default Footer;