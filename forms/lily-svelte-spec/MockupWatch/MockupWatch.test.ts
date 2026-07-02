import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupWatch from "./MockupWatch.svelte";

describe("MockupWatch", () => {
    test("renders with content", () => {
        render(MockupWatch, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-watch");
    });
});
