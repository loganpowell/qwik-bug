import { component$, useStore } from "@builder.io/qwik";

export default component$(() => {
  const state = useStore({ count: 0, name: "test" });

  return (
    <div style={{ padding: "40px" }}>
      <h1>String Concatenation Test</h1>
      
      <p>
        This tests if multiple interpolations cause string concatenation issues
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h2>Test 1: Multiple interpolations with strings</h2>
        <p>Count: {state.count} | Name: {state.name}</p>
        <button onClick$={() => state.count++}>Increment</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Test 2: Single interpolation</h2>
        <p>{state.count}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Test 3: Template string</h2>
        <p>{`Count: ${state.count} | Name: ${state.name}`}</p>
      </div>
      
      <div>
        <h3>Expected behavior:</h3>
        <p>All three tests should show count incrementing by 1 each click</p>
        <p>If Test 1 shows concatenation (e.g., "01", "011", etc.), it's a bug</p>
      </div>
    </div>
  );
});
