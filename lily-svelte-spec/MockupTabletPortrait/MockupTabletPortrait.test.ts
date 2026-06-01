import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupTabletPortrait from "./MockupTabletPortrait.svelte";

describe("MockupTabletPortrait", () => {
    test("renders with content", () => {
        render(MockupTabletPortrait, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-tablet-portrait");
    });
});
