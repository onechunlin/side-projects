import { useState } from "react";
import LocalView from "./components/local-view";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <LocalView />
    </div>
  );
}

export default App;
