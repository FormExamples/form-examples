import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupLaptop from "./MockupLaptop.svelte";

describe("MockupLaptop", () => {
    test("renders with content", () => {
        render(MockupLaptop, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-laptop");
    });
});
