import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupShell from "./MockupShell.svelte";

describe("MockupShell", () => {
    test("renders with content", () => {
        render(MockupShell, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-shell");
    });
});
