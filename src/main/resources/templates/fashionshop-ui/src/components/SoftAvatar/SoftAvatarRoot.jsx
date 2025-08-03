
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

export default styled(Avatar)(({ theme, ownerState }) => {
  const { palette, functions, typography, boxShadows } = theme;
  const { shadow, bgColor, size } = ownerState;

  const { gradients = {}, transparent = {} } = palette;
  const { pxToRem, linearGradient } = functions;
  const { size: fontSize, fontWeightBold } = typography;

  // backgroundImage value (Safe Access)
  let backgroundValue;
  if (bgColor === "transparent") {
    backgroundValue = transparent?.main || "transparent";
  } else if (gradients[bgColor]?.main && gradients[bgColor]?.state) {
    backgroundValue = linearGradient(gradients[bgColor].main, gradients[bgColor].state);
  } else {
    // fallback: use a default background if bgColor is not found in gradients
    backgroundValue = "#fff";
    // Optionally, you can log a warning for debugging:
    // console.warn(`Unknown bgColor "${bgColor}" for SoftAvatarRoot, fallback to #fff`);
  }

  // size value
  let sizeValue;

  switch (size) {
    case "xs":
      sizeValue = {
        width: pxToRem(24),
        height: pxToRem(24),
        fontSize: fontSize?.xs || pxToRem(12),
      };
      break;
    case "sm":
      sizeValue = {
        width: pxToRem(36),
        height: pxToRem(36),
        fontSize: fontSize?.sm || pxToRem(14),
      };
      break;
    case "lg":
      sizeValue = {
        width: pxToRem(58),
        height: pxToRem(58),
        fontSize: fontSize?.sm || pxToRem(14),
      };
      break;
    case "xl":
      sizeValue = {
        width: pxToRem(74),
        height: pxToRem(74),
        fontSize: fontSize?.md || pxToRem(16),
      };
      break;
    case "xxl":
      sizeValue = {
        width: pxToRem(110),
        height: pxToRem(110),
        fontSize: fontSize?.md || pxToRem(16),
      };
      break;
    default: {
      sizeValue = {
        width: pxToRem(48),
        height: pxToRem(48),
        fontSize: fontSize?.md || pxToRem(16),
      };
    }
  }

  return {
    background: backgroundValue,
    fontWeight: fontWeightBold,
    boxShadow: boxShadows?.[shadow] || "none",
    ...sizeValue,
  };
});