import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ClipboardCopyButton.svelte";

// Helper: mock navigator.clipboard.writeText for the duration of a test.
function mockClipboard(impl?: (text: string) => Promise<void>) {
  const writeText = vi.fn<(text: string) => Promise<void>>(
    impl ?? (() => Promise.resolve()),
  );
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    writable: true,
    configurable: true,
  });
  return writeText;
}

describe("ClipboardCopyButton", () => {
  test("renders as a button", () => {
    mockClipboard();
    render(Subject, { props: { text: "hello", label: "Copy" } });
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });

  test("has aria-label", () => {
    mockClipboard();
    render(Subject, { props: { text: "hello", label: "Copy text" } });
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe(
      "Copy text",
    );
  });

  test("copies text to clipboard on click", async () => {
    const writeText = mockClipboard();
    const handleSuccess = vi.fn();
    render(Subject, {
      props: {
        text: "copied text",
        label: "Copy",
        onsuccess: handleSuccess,
      },
    });

    screen.getByRole("button").click();
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("copied text");
    });
    await vi.waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledOnce();
    });
  });

  test("sets data-copied on success", async () => {
    mockClipboard();
    render(Subject, { props: { text: "test", label: "Copy" } });
    const button = screen.getByRole("button");

    button.click();
    await vi.waitFor(() => {
      expect(button.getAttribute("data-copied")).toBe("true");
    });
  });

  test("calls onerror on failure", async () => {
    const error = new Error("fail");
    mockClipboard(() => Promise.reject(error));

    const handleError = vi.fn();
    render(Subject, {
      props: {
        text: "test",
        label: "Copy",
        onerror: handleError,
      },
    });

    screen.getByRole("button").click();
    await vi.waitFor(() => {
      expect(handleError).toHaveBeenCalledWith(error);
    });
  });

  test("is focusable via keyboard", async () => {
    mockClipboard();
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { text: "test", label: "Copy" } });
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
  });

  test("passes through additional HTML attributes", () => {
    mockClipboard();
    render(Subject, {
      props: { text: "test", label: "Copy", "data-testid": "clip" },
    });
    expect(screen.getByTestId("clip")).toBeTruthy();
  });
});
