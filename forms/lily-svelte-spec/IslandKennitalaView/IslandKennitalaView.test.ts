import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IslandKennitalaView.svelte";

describe("IslandKennitalaView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Identity Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identity Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("island-kennitala-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Identity Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identity Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Identity Code" } });

        const el = screen.getByLabelText("Personal Identity Code");
        expect(el.getAttribute("aria-label")).toBe("Personal Identity Code");
    });
});
