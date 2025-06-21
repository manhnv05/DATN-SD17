

import { createContext, useContext } from "react";
import PropTypes from "prop-types";

// The Timeline main context
const Timeline = createContext();

// Timeline context provider
function TimelineProvider({ children, value }) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}
TimelineProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired,
};

export { TimelineProvider, useTimeline };
/* eslint-enable react/prop-types */
/* eslint-enable react/prop-types */
