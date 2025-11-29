import {
  component$,
  useContextProvider,
  useStore,
  createContextId,
  useContext,
  $,
} from "@builder.io/qwik";
import { updateIn } from "@thi.ng/paths";

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
  const state = useContext(CountContext);

  const increment = $(() => {
    console.log("Before updateIn:", state.count, typeof state.count);
    const newState = updateIn(state, ["count"], (c: number) => c + 1);
    Object.assign(state, newState);
  });

  return (
    <div style={{ border: "2px solid red", padding: "20px" }}>
      <h2>❌ BUG: Using updateIn + Object.assign</h2>
      <p>
        Count: {state.count} | More string {state.count}
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
