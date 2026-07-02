import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AlbaCommunityHealthIndexView.svelte";

describe("AlbaCommunityHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Community Health Index", value: "test-value" } });

        const el = screen.getByLabelText("Community Health Index");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("alba-community-health-index-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Community Health Index", value: "test-value" } });

        const el = screen.getByLabelText("Community Health Index");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const el = screen.getByLabelText("Community Health Index");
        expect(el.getAttribute("aria-label")).toBe("Community Health Index");
    });
});
