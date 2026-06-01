import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BelgiqueNumeroDeRegistreNationalView.svelte";

describe("BelgiqueNumeroDeRegistreNationalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Register Number", value: "test-value" } });

        const el = screen.getByLabelText("National Register Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("belgique-numero-de-registre-national-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Register Number", value: "test-value" } });

        const el = screen.getByLabelText("National Register Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Register Number" } });

        const el = screen.getByLabelText("National Register Number");
        expect(el.getAttribute("aria-label")).toBe("National Register Number");
    });
});
