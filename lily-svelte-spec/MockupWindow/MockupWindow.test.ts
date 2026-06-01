import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupWindow from "./MockupWindow.svelte";

describe("MockupWindow", () => {
    test("renders with content", () => {
        render(MockupWindow, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-window");
    });
});
