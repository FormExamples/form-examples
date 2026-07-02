import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ScreenReaderSpan from "./ScreenReaderSpan.svelte";

describe("ScreenReaderSpan", () => {
    test("renders with content", () => {
        render(ScreenReaderSpan, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("screen-reader-span");
    });
});
