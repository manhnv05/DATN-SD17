import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React context
import { useSoftUIController } from "context";

function SidenavCollapse({ color, icon, name, children, active, noCollapse, open, ...rest }) {
  const [controller] = useSoftUIController();
  const { miniSidenav } = controller;

  return (
    <>
      <ListItem component="li" disablePadding sx={{ width: "100%" }}>
        <SoftBox
          {...rest}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            borderRadius: 2,
            background: active ? "#e3f4ff" : "transparent", // nền item khi active
            cursor: "pointer",
            width: "100%",
            transition: "background 0.2s",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 2,
              borderRadius: 2,
              width: 32,
              height: 32,
              background: active ? "#38b6ff" : "#f1f2f6", // nền icon khi active
              color: active ? "#fff" : "#6c757d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {typeof icon === "string" ? (
              <Icon sx={{ fontSize: 22 }}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          {/* Ẩn chữ khi thu nhỏ menu */}
          {!miniSidenav && (
            <ListItemText
              primary={name}
              primaryTypographyProps={{
                sx: {
                  color: active ? "#38b6ff" : "#6c757d",
                  fontWeight: active ? 700 : 400,
                  fontSize: 16,
                  transition: "color 0.2s",
                  ml: 1.5,
                },
              }}
            />
          )}
        </SoftBox>
      </ListItem>
      {children && (
        <Collapse in={open} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  color: "info",
  active: false,
  noCollapse: false,
  children: false,
  open: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
};

export default SidenavCollapse;