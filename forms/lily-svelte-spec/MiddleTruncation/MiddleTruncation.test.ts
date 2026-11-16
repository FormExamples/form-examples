import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import MiddleTruncation from "./MiddleTruncation.svelte";

// jsdom has no layout and no canvas: stub a width and a monospace metric (one unit per character).
let width = 8;
let observers: Array<() => void> = [];

beforeEach(() => {
    width = 8;
    observers = [];
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() => ({
        font: "",
        measureText: (s: string) => ({ width: [...s].length }),
    })) as never);
    vi.stubGlobal(
        "ResizeObserver",
        class {
            constructor(cb: () => void) {
                observers.push(cb);
            }
            observe() {}
            disconnect() {}
        },
    );
    vi.stubGlobal("requestAnimationFrame", (cb: () => void) => {
        cb();
        return 1;
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

const text = "abcdefghijklmnopqrstuvwxyz";

describe("MiddleTruncation", () => {
    it("renders a <span> with the base class first, then the consumer class", () => {
        const { container } = render(MiddleTruncation, {
            props: { text, ellipsis: "…", class: "mine" },
        });
        expect(container.querySelector("span.middle-truncation")!.getAttribute("class")).toBe(
            "middle-truncation mine",
        );
    });

    it("shortens the visual text to the measured width", async () => {
        const { container } = render(MiddleTruncation, { props: { text, ellipsis: "…" } });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe("abc…wxyz");
    });

    it("keeps the full text in the accessibility tree and hides the shortened copy from it", async () => {
        const { container } = render(MiddleTruncation, { props: { text, ellipsis: "…" } });
        await tick();
        const visual = container.querySelector(".middle-truncation-visual")!;
        const full = container.querySelector(".middle-truncation-full")!;
        expect(visual.getAttribute("aria-hidden")).toBe("true");
        expect(full.textContent).toBe(text);
        expect(full.closest("[aria-hidden]")).toBeNull();
    });

    it("shows the full text when it fits, and marks neither as truncated", async () => {
        width = 100;
        const { container } = render(MiddleTruncation, { props: { text, ellipsis: "…" } });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe(text);
        expect(container.querySelector(".middle-truncation")!.hasAttribute("data-truncated")).toBe(
            false,
        );
    });

    it("sets data-truncated and data-strategy", async () => {
        const { container } = render(MiddleTruncation, {
            props: { text, ellipsis: "…", strategy: "fixed-end", end: 4 },
        });
        await tick();
        const root = container.querySelector(".middle-truncation")!;
        expect(root.hasAttribute("data-truncated")).toBe(true);
        expect(root.getAttribute("data-strategy")).toBe("fixed-end");
    });

    it("uses the consumer's ellipsis, with no default of its own", async () => {
        const { container } = render(MiddleTruncation, {
            props: { text, ellipsis: "[...]", strategy: "even" },
        });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe("a[...]yz");
    });

    it("keeps `end` characters at the end for fixed-end", async () => {
        width = 12;
        const { container } = render(MiddleTruncation, {
            props: { text, ellipsis: "…", strategy: "fixed-end", end: 4 },
        });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe(
            "abcdefg…wxyz",
        );
    });

    it("re-measures when the container resizes, changing only the visual string", async () => {
        const { container } = render(MiddleTruncation, { props: { text, ellipsis: "…" } });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe("abc…wxyz");
        width = 12;
        observers.forEach((cb) => cb());
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe(
            "abcde…uvwxyz",
        );
        expect(container.querySelector(".middle-truncation-full")!.textContent).toBe(text);
    });

    it("shows the full text when there is no layout width", async () => {
        width = 0;
        const { container } = render(MiddleTruncation, { props: { text, ellipsis: "…" } });
        await tick();
        expect(container.querySelector(".middle-truncation-visual")!.textContent).toBe(text);
    });

    it("passes rest props to the root", () => {
        const { container } = render(MiddleTruncation, {
            props: { text, ellipsis: "…", "data-testid": "mt", id: "x" },
        });
        const root = container.querySelector("span.middle-truncation")!;
        expect(root.getAttribute("data-testid")).toBe("mt");
        expect(root.id).toBe("x");
    });
});
