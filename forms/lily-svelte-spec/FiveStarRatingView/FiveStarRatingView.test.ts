import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FiveStarRatingView.svelte";

describe("FiveStarRatingView", () => {
    test("renders with img role", () => {
        render(Subject, { props: { value: 3, label: "3 of 5" } });
        expect(screen.getByRole("img", { name: "3 of 5" })).toBeTruthy();
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: 4, label: "4 stars" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("4");
    });

    test("shows 5 star spans", () => {
        render(Subject, { props: { value: 3, label: "R", "data-testid": "rv" } });
        const spans = screen.getByTestId("rv").querySelectorAll("[aria-hidden]");
        expect(spans).toHaveLength(5);
    });

    test("fills correct number of stars", () => {
        render(Subject, { props: { value: 3, label: "R", "data-testid": "rv" } });
        const filled = screen.getByTestId("rv").querySelectorAll("[data-filled='true']");
        expect(filled).toHaveLength(3);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 1, label: "R", "data-testid": "rv" } });
        expect(screen.getByTestId("rv")).toBeTruthy();
    });
});
