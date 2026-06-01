import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Citation from "./Citation.svelte";

describe("Citation", () => {
    test("renders with content", () => {
        render(Citation, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("citation");
    });
});
