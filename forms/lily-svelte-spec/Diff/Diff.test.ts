import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Diff from "./Diff.svelte";

describe("Diff", () => {
    test("renders with content", () => {
        render(Diff, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("diff");
    });
});
