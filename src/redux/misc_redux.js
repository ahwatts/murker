// Miscellaneous Redux actions that don't quite warrant their own
// file.

import * as R from "ramda";

const Types = R.indexBy(R.identity, [
  "UPDATE",
  "RENDER",
  "STARTUP",
]);

const Actions = {
  update: () => ({ type: Types.UPDATE }),
  render: () => ({ type: Types.RENDER }),
  startup: () => ({ type: Types.STARTUP }),
};

export default { Types, Actions };
