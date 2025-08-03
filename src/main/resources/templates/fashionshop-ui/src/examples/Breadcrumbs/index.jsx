import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Breadcrumbs from "@mui/material/Breadcrumbs"; // ✅
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function BreadcrumbsComponent({ icon, title, route, light }) {
    const routes = route.slice(0, -1);

    return (
        <SoftBox mr={{ xs: 0, xl: 8 }} sx={{ userSelect: "none" }}>
            <Breadcrumbs
                sx={{
                    userSelect: "none",
                    "& .MuiBreadcrumbs-separator": {
                        color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
                        userSelect: "none",
                    },
                }}
            >
                <Link to="/" style={{ userSelect: "none" }}>
                    <SoftTypography
                        component="span"
                        variant="body2"
                        color={light ? "white" : "dark"}
                        opacity={light ? 0.8 : 0.5}
                        sx={{ lineHeight: 0, userSelect: "none" }}
                    >
                        <Icon sx={{ userSelect: "none" }}>{icon}</Icon>
                    </SoftTypography>
                </Link>
                {routes.map((el) => (
                    <Link to={`/${el}`} key={el} style={{ userSelect: "none" }}>
                        <SoftTypography
                            component="span"
                            variant="button"
                            fontWeight="regular"
                            textTransform="capitalize"
                            color={light ? "white" : "dark"}
                            opacity={light ? 0.8 : 0.5}
                            sx={{ lineHeight: 0, userSelect: "none" }}
                        >
                            {el}
                        </SoftTypography>
                    </Link>
                ))}
                <SoftTypography
                    variant="button"
                    fontWeight="regular"
                    textTransform="capitalize"
                    color={light ? "white" : "dark"}
                    sx={{ lineHeight: 0, userSelect: "none" }}
                >
                    {title.replace("-", " ")}
                </SoftTypography>
            </Breadcrumbs>
            <SoftTypography
                fontWeight="bold"
                textTransform="capitalize"
                variant="h6"
                color={light ? "white" : "dark"}
                noWrap
                sx={{ userSelect: "none" }}
            >
                {title.replace("-", " ")}
            </SoftTypography>
        </SoftBox>
    );
}

BreadcrumbsComponent.defaultProps = {
    light: false,
};

BreadcrumbsComponent.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    light: PropTypes.bool,
};

export default BreadcrumbsComponent;