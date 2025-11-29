import {
  component$,
  useContextProvider,
  useStore,
  createContextId,
  $,
} from "@builder.io/qwik";

import { useContextCursor } from "./hooks/useContextCursor";
// import { updateIn } from "@thi.ng/paths";

export const CountContext = createContextId<{
  count: number;
}>("count-context");

export default component$(() => {
  const state = useStore({ count: 0 });
  useContextProvider(CountContext, state);

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik updateIn Bug Reproduction</title>
      </head>
      <body>
        <Counter />
      </body>
    </>
  );
});

const Counter = component$(() => {
  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Qwik + @thi.ng/paths updateIn Bug</h1>
      <div style={{ marginTop: "40px" }}>
        <CounterWithUpdateIn />
      </div>
    </div>
  );
});

// BUG: Using updateIn + Object.assign
const CounterWithUpdateIn = component$(() => {
  const [count, countCursor] = useContextCursor(CountContext, ["count"]);

  const increment = $(() => {
    console.log("Before updateIn:", count, typeof count);
    // const newState = updateIn(state, ["count"], (c: number) => c + 1);
    // Object.assign(state, newState);
    countCursor.swap((c) => c + 1);
  });

  return (
    <div style={{ border: "2px solid red", padding: "20px" }}>
      <h2>❌ BUG: Using updateIn + Object.assign</h2>
      <p>
        Count: {count} | More string {count}
      </p>
      <button onClick$={increment}>Increment (shows bug)</button>
      <p
        style={{
          fontSize: "12px",
          color: "#666",
          marginTop: "10px",
        }}
      >
        Expected: increments by 1<br />
        Actual: May show unexpected behavior
      </p>
    </div>
  );
});
