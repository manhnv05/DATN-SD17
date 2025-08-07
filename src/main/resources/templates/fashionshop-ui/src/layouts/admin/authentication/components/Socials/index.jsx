import SoftButton from "../../../../../components/SoftButton";
import SoftBox from "../../../../../components/SoftBox";
import { Google } from "@mui/icons-material";

function Socials() {
    // Hàm chuyển hướng đến endpoint OAuth2 phù hợp với provider
    const handleOAuth = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <SoftBox display="flex" justifyContent="center" gap={1.5}>
            {/* Google */}
            <SoftButton variant="outlined" color="light" onClick={() => handleOAuth("google")}>
                <Google style={{ color: "#EA4335", fontSize: 26 }} />
            </SoftButton>
            {/* Facebook */}
            <SoftButton variant="outlined" color="light" onClick={() => handleOAuth("facebook")}>
                {/* Facebook SVG - icon trắng */}
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#1877f3" />
                    <path
                        d="M21 10.5h-3v-1.25c0-.41.34-.75.75-.75h2.25v-3H18c-1.8 0-3.25 1.45-3.25 3.25V10.5H12v3h2.75V24h3.5v-10.5h2.25l.5-3z"
                        fill="#fff"
                    />
                </svg>
            </SoftButton>
            {/* X (Twitter) */}
            <SoftButton variant="outlined" color="light" onClick={() => handleOAuth("twitter")}>
                {/* X logo SVG */}
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                     width="26" height="26" viewBox="0 0 640.000000 640.000000"
                     preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)"
                       fill="#000000" stroke="none">
                        <path d="M2980 6394 c-25 -2 -103 -11 -175 -20 -1355 -165 -2468 -1193 -2739
                        -2529 -49 -241 -60 -362 -60 -645 0 -283 11 -404 60 -645 247 -1218 1203
                        -2196 2419 -2474 757 -173 1570 -62 2240 306 913 500 1508 1372 1651 2418 25
                        182 25 607 0 790 -100 734 -404 1353 -916 1866 -508 509 -1134 817 -1860 914
                        -110 15 -524 27 -620 19z m-44 -2039 c251 -366 460 -665 464 -665 4 0 264 299
                        579 665 l572 665 156 0 c148 0 155 -1 141 -17 -8 -10 -306 -357 -662 -771
                        -419 -487 -644 -757 -639 -765 4 -6 324 -473 711 -1037 387 -563 706 -1030
                        709 -1037 4 -11 -96 -13 -520 -13 l-526 0 -483 705 c-266 387 -485 704 -488
                        704 -3 1 -277 -316 -610 -704 l-605 -704 -153 -1 c-89 0 -152 4 -150 9 2 5
                        300 355 664 778 364 422 673 782 687 799 l27 31 -686 999 c-378 549 -689 1004
                        -691 1011 -4 10 99 13 520 13 l526 0 457 -665z"/>
                        <path d="M1898 4709 c28 -39 527 -752 1109 -1585 l1058 -1514 238 0 c130 0
                        237 3 236 8 0 4 -496 716 -1102 1582 l-1102 1575 -243 3 -244 2 50 -71z"/>
                    </g>
                </svg>
            </SoftButton>
        </SoftBox>
    );
}

export default Socials;