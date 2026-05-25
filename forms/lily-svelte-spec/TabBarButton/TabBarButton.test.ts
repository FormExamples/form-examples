import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TabBarButton.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TabBarButton", () => {
    test("renders a tab", () => {
        render(Subject, { props: { controls: "panel-1", children: textSnippet("Dashboard") } });
        expect(screen.getByRole("tab")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(Subject, { props: { controls: "panel-1", children: textSnippet("Dashboard") } });
        expect(screen.getByRole("tab").tagName).toBe("BUTTON");
    });

    test("renders children", () => {
        render(Subject, { props: { controls: "panel-1", children: textSnippet("Settings") } });
        expect(screen.getByRole("tab").textContent).toContain("Settings");
    });

    test("is not selected by default", () => {
        render(Subject, { props: { controls: "panel-1", children: textSnippet("Tab") } });
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("false");
    });

    test("reflects selected state when true", () => {
        render(Subject, { props: { selected: true, controls: "panel-1", children: textSnippet("Tab") } });
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("true");
    });

    test("has aria-controls pointing to panel id", () => {
        render(Subject, { props: { controls: "settings-panel", children: textSnippet("Settings") } });
        expect(screen.getByRole("tab").getAttribute("aria-controls")).toBe("settings-panel");
    });

    test("has tabindex 0 when selected", () => {
        render(Subject, { props: { selected: true, controls: "panel-1", children: textSnippet("Tab") } });
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        render(Subject, { props: { controls: "panel-1", children: textSnippet("Tab") } });
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { controls: "panel-1", "data-testid": "my-tab", children: textSnippet("Tab") } });
        expect(screen.getByTestId("my-tab")).toBeTruthy();
    });
});
