import { render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./CharacterCounter.svelte";

const root = (container: HTMLElement) => container.querySelector(".character-counter")!;
const visible = (container: HTMLElement) => container.querySelector(".character-counter-text")!;

describe("CharacterCounter", () => {
    afterEach(() => vi.useRealTimers());

    test("renders a span with the base class, a visible count and a status", () => {
        const { container } = render(Subject, { props: { count: 5, max: 280 } });
        expect(root(container).tagName).toBe("SPAN");
        expect(root(container).hasAttribute("role")).toBe(false);
        expect(root(container).hasAttribute("aria-live")).toBe(false);
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("displays count only when no max", () => {
        const { container } = render(Subject, { props: { count: 42 } });
        expect(visible(container).textContent).toBe("42");
        expect(screen.getByRole("status").textContent).toBe("42");
    });

    test("displays count / max when max provided", () => {
        const { container } = render(Subject, { props: { count: 50, max: 280 } });
        expect(visible(container).textContent).toBe("50 / 280");
    });

    test("the visible count is hidden from assistive technology; the status is what is read", () => {
        const { container } = render(Subject, { props: { count: 1 } });
        expect(visible(container).getAttribute("aria-hidden")).toBe("true");
        expect(screen.getByRole("status").classList.contains("screen-reader-span")).toBe(true);
    });

    test("a run of changes is announced once, after the pause", async () => {
        vi.useFakeTimers();
        const { container, rerender } = render(Subject, { props: { count: 0, max: 10 } });
        const status = screen.getByRole("status");
        for (const count of [1, 2, 3, 4]) {
            await rerender({ count, max: 10 });
            vi.advanceTimersByTime(300);
        }
        expect(visible(container).textContent).toBe("4 / 10");
        expect(status.textContent).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
        expect(status.textContent).toBe("4 / 10");
    });

    test("announceDelay sets the pause", async () => {
        vi.useFakeTimers();
        const { rerender } = render(Subject, { props: { count: 0, announceDelay: 200 } });
        await rerender({ count: 7, announceDelay: 200 });
        vi.advanceTimersByTime(199);
        expect(screen.getByRole("status").textContent).toBe("0");
        vi.advanceTimersByTime(1);
        await Promise.resolve();
        expect(screen.getByRole("status").textContent).toBe("7");
    });

    test("exposes data-count and data-remaining on the root", () => {
        const { container } = render(Subject, { props: { count: 50, max: 280 } });
        expect(root(container).getAttribute("data-count")).toBe("50");
        expect(root(container).getAttribute("data-remaining")).toBe("230");
    });

    test("exposes data-over-limit when over max, and not when under", () => {
        const over = render(Subject, { props: { count: 300, max: 280 } });
        expect(root(over.container).getAttribute("data-over-limit")).toBe("true");
        over.unmount();
        const under = render(Subject, { props: { count: 100, max: 280 } });
        expect(root(under.container).getAttribute("data-over-limit")).toBeNull();
    });

    test("applies aria-label to the status", () => {
        render(Subject, { props: { label: "Character count" } });
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Character count");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "counter" } });
        expect(screen.getByTestId("counter").classList.contains("character-counter")).toBe(true);
    });
});
