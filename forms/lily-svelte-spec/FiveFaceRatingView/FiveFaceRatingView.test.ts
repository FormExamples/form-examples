import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FiveFaceRatingView.svelte";

describe("FiveFaceRatingView", () => {
    test("renders with img role", () => {
        render(Subject, { props: { value: 3, label: "Okay" } });
        expect(screen.getByRole("img", { name: "Okay" })).toBeTruthy();
    });

    test("displays face label for value", () => {
        render(Subject, { props: { value: 4, label: "R" } });
        expect(screen.getByRole("img").textContent).toContain("Good");
    });

    test("has data-value", () => {
        render(Subject, { props: { value: 2, label: "R" } });
        expect(screen.getByRole("img").getAttribute("data-value")).toBe("2");
    });

    test("supports custom labels", () => {
        render(Subject, { props: { value: 1, label: "R", labels: ["Awful", "Poor", "Fine", "Nice", "Great"] } });
        expect(screen.getByRole("img").textContent).toContain("Awful");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: 1, label: "R", "data-testid": "fv" } });
        expect(screen.getByTestId("fv")).toBeTruthy();
    });
});
