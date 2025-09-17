import { useMemo } from "react";
import PropTypes from "prop-types";

// @mui material components
import Table from "@mui/material/Table"; // ✅ Sửa import này
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

import ProductSlideshow from "layouts/admin/BanHangTaiQuay/component/ProductSlideshow";

function CustomTable({ columns, rows }) { // Đổi tên để tránh đè Table của MUI
    const { light } = colors;
    const { size, fontWeightBold } = typography;
    const { borderWidth } = borders;

    const renderColumns = columns.map(({ name, label, align, width }, key) => {
        let pl;
        let pr;

        if (key === 0) {
            pl = 3;
            pr = 3;
        } else if (key === columns.length - 1) {
            pl = 3;
            pr = 3;
        } else {
            pl = 1;
            pr = 1;
        }

        return (
            <SoftBox
                key={name}
                component="th"
                width={width || "auto"}
                pt={1.5}
                pb={1.25}
                pl={align === "left" ? pl : 3}
                pr={align === "right" ? pr : 3}
                textAlign={align}
                fontSize={size.xxs}
                fontWeight={fontWeightBold}
                color="black"
                opacity={0.7}
                borderBottom={`${borderWidth[1]} solid ${light.main}`}
            >
                {label || name}
            </SoftBox>
        );
    });

    const renderRows = rows.map((row, rowIdx) => {
        const rowKey = row.id ? `row-${row.id}` : `row-${rowIdx}`;

        console.log(row["anh"])

        const tableRow = columns.map((col, colIdx) => {
            const { name, align, render } = col;
            let cellContent;

            if (typeof render === "function") {
                cellContent = render(row[name], row, rowIdx);
            } else if (Array.isArray(row[name])) {
                cellContent = (
                    <SoftBox display="flex" alignItems="center" py={0.5} px={1}>
                        <SoftBox mr={2}>
                            <ProductSlideshow product={{listUrlImage:row["anh"]}} />
                        </SoftBox>
                        {/* <SoftTypography variant="button" fontWeight="medium" sx={{ width: "max-content" }}>
                            {row[name]}
                        </SoftTypography> */}
                    </SoftBox>
                );
            } else {
                cellContent = (
                    <SoftTypography
                        variant="button"
                        fontWeight="regular"
                        color="black"
                        sx={{ display: "inline-block", width: "max-content", userSelect: "text" }}
                    >
                        {row[name]}
                    </SoftTypography>
                );
            }

            return (
                <SoftBox
                    key={name || colIdx}
                    component="td"
                    p={1}
                    textAlign={align}
                    borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
                >
                    {cellContent}
                </SoftBox>
            );
        });

        return <TableRow key={rowKey}>{tableRow}</TableRow>;
    });

    return useMemo(
        () => (
            <TableContainer sx={{ userSelect: "text" }}>
                <Table>
                    <SoftBox component="thead">
                        <TableRow>{renderColumns}</TableRow>
                    </SoftBox>
                    <TableBody>{renderRows}</TableBody>
                </Table>
            </TableContainer>
        ),
        [columns, rows]
    );
}

// Setting default values for the props of Table
CustomTable.defaultProps = {
    columns: [],
    rows: [{}],
};

CustomTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.object),
};

export default CustomTable;