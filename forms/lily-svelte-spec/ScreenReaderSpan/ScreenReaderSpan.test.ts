import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ScreenReaderSpan from "./ScreenReaderSpan.svelte";

describe("ScreenReaderSpan", () => {
    test("renders with content", () => {
        const { container } = render(ScreenReaderSpan, { props: {} as any });
        const el = container.querySelector(".screen-reader-span");
        expect(el).toBeTruthy();
        expect(el?.hasAttribute("aria-label")).toBe(false);
    });
});
