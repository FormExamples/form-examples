import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Place from "./Place.svelte";

describe("Place", () => {
    test("renders with content", () => {
        render(Place, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("place");
    });
});
