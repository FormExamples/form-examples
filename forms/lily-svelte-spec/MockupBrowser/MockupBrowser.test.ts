import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupBrowser from "./MockupBrowser.svelte";

describe("MockupBrowser", () => {
    test("renders with content", () => {
        render(MockupBrowser, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-browser");
    });
});
