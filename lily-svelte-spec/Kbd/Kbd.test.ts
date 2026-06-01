import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Kbd from "./Kbd.svelte";

describe("Kbd", () => {
    test("renders with content", () => {
        render(Kbd, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("kbd");
    });
});
