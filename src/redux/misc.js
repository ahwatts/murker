// Miscellaneous Redux actions that don't quite warrant their own
// file.

export const UPDATE = "UPDATE";
export const RENDER = "RENDER";
export const STARTUP = "STARTUP";

export const MiscActions = {
  update: () => ({ type: UPDATE }),
  render: () => ({ type: RENDER }),
  startup: () => ({ type: STARTUP }),
};
