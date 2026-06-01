import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextInputWithSearch from "./TextInputWithSearch.svelte";

describe("TextInputWithSearch", () => {
    test("renders with content", () => {
        render(TextInputWithSearch, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("text-input-with-search");
    });
});
