import * as React from "react";
import { Keyboard } from "../..";

export default function App() {
  const [combo, setCombo] = React.useState("");

  const keyboard = React.useMemo(() => {
    const keyboard = new Keyboard();

    keyboard.addListener((e, combo) => {
      setCombo(combo);
    });

    return keyboard;
  }, [setCombo]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div>
        <textarea
          style={{ width: "200px", maxWidth: "100%", height: "100px" }}
          onKeyDown={keyboard.getHandler()}
        />
      </div>
      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          padding: "1em",
          fontSize: "2em",
        }}
      >
        {combo}
      </div>
    </div>
  );
}
