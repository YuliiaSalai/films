import { renderHook, act } from "@testing-library/react-hooks";
import useCounter from "counter/useCounter";

test("useCounter", () => {
  const { result } = renderHook(useCounter);

  expect(result.current.count).toBe(0);

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});

test("allows customization initial count", () => {
  const { result } = renderHook(useCounter, {
    initialProps: { initialCount: 3 },
  });

  expect(result.current.count).toBe(3);

  act(() => result.current.increment());
  expect(result.current.count).toBe(4);
});

test("allows customization step", () => {
  const { result } = renderHook(useCounter, {
    initialProps: { step: 3 },
  });
  expect(result.current.count).toBe(0);

  act(() => result.current.increment());
  expect(result.current.count).toBe(3);
});
