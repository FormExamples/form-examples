import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupTabletLandscape from "./MockupTabletLandscape.svelte";

describe("MockupTabletLandscape", () => {
    test("renders with content", () => {
        render(MockupTabletLandscape, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-tablet-landscape");
    });
});
