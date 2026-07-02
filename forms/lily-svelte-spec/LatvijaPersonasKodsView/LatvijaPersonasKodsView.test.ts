import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LatvijaPersonasKodsView.svelte";

describe("LatvijaPersonasKodsView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("latvija-personas-kods-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const el = screen.getByLabelText("Personal Code");
        expect(el.getAttribute("aria-label")).toBe("Personal Code");
    });
});
