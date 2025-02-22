import { useEffect, useState } from "react";

import init, { add } from "../../frontman-wasm";

function Dbg() {
//   init().then(() => {});
  return (
    <div>hello {1}</div>
    // <div>hello {add(2, 7)}</div>
  )
}

export default Dbg;
