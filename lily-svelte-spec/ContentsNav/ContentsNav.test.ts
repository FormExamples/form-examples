import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsNav.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContentsNav", () => {
    test("renders as navigation landmark", () => {
        render(Subject, { props: { label: "On this page", children: textSnippet("Items") } });
        expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Contents", children: textSnippet("Items") } });
        expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("Contents");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Contents", children: textSnippet("Section 1") } });
        expect(screen.getByRole("navigation").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Contents", "data-testid": "cn", children: textSnippet("Items") } });
        expect(screen.getByTestId("cn")).toBeTruthy();
    });
});
