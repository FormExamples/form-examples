import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenskoRodneCisloView.svelte";

describe("SlovenskoRodneCisloView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Slovak Personal Number", value: "test-value" } });

        const el = screen.getByLabelText("Slovak Personal Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovensko-rodne-cislo-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Slovak Personal Number", value: "test-value" } });

        const el = screen.getByLabelText("Slovak Personal Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Slovak Personal Number" } });

        const el = screen.getByLabelText("Slovak Personal Number");
        expect(el.getAttribute("aria-label")).toBe("Slovak Personal Number");
    });
});
