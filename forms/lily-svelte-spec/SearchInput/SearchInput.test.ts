import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SearchInput.svelte";

describe("SearchInput", () => {
    test("renders a search input", () => {
        render(Subject, { props: { label: "Search" } });
        expect(screen.getByRole("searchbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Search site" } });
        expect(screen.getByLabelText("Search site")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Search", required: true } });
        expect((screen.getByRole("searchbox") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Search", disabled: true } });
        expect((screen.getByRole("searchbox") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Search", "data-testid": "si" } });
        expect(screen.getByTestId("si")).toBeTruthy();
    });
});
