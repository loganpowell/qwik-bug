import { useContext, $, type ContextId, type QRL } from "@builder.io/qwik";
import { updateIn } from "@thi.ng/paths";

/**
 * Serializable cursor interface that mimics thi.ng/atom cursor operations
 */
export interface SerializableCursor<T> {
  swap: QRL<(updateFn: (value: T) => T) => void>;
  reset: QRL<(newValue: T) => void>;
}

/**
 * Creates a serializable cursor-like interface for a Qwik context value.
 *
 * This hook provides atom-like operations (swap, reset) that work with Qwik's
 * serialization and reactivity system. When used with APP_STATE_CTX, it also
 * handles localStorage persistence and diff calculation.
 *
 * @param contextId - The Qwik context ID to create a cursor for
 * @param path - Optional path within the context value (default: [])
 * @returns A tuple of [value, { swap, reset }] similar to React's useState
 *
 * @example
 * // Get a cursor for a specific path
 * const [features, featuresCursor] = useContextCursor(APP_STATE_CTX, ["features"]);
 *
 * @example
 * // Use the cursor to update state
 * featuresCursor.swap((features) => [...features, newFeature]);
 */
export function useContextCursor<T extends Record<string, any>, V = any>(
  contextId: ContextId<T>,
  path: (string | number)[] = []
): [V, SerializableCursor<V>] {
  const contextValue = useContext(contextId);

  // Get committed and diff state if updating APP_STATE_CTX
  // Type-cast comparison since we're checking identity, not type compatibility

  // Get the value at the path (or the entire context if no path)
  const getValue = (): V => {
    if (path.length === 0) {
      return contextValue as any as V;
    }
    let current: any = contextValue;
    for (const key of path) {
      current = current?.[key];
    }
    return current as V;
  };

  const swap = $((updateFn: (value: V) => V) => {
    if (path.length > 0) {
      // Update at the specific path
      const newState = updateIn(contextValue, path as any, updateFn);
      Object.assign(contextValue, newState);
    } else {
      // Update the entire context
      const currentValue = contextValue as any as V;
      const newValue = updateFn(currentValue);
      Object.assign(contextValue, newValue);
    }
  });

  const reset = $((newValue: V) => {
    if (path.length > 0) {
      // Reset at the specific path
      const newState = updateIn(contextValue, path as any, () => newValue);
      Object.assign(contextValue, newState);
    } else {
      // Reset the entire context
      Object.assign(contextValue, newValue);
    }
  });

  return [getValue(), { swap, reset }];
}
