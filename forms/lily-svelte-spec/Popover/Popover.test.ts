import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Popover.svelte";
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}
// jsdom has no Popover API, so these run the scripted fallback (the `hidden` attribute);
// popover-api.test.ts covers the native path with showPopover/hidePopover stubbed.
describe("Popover", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false, children: textSnippet("C") } });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("hidden")).toBe(true);
    });
    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });
    test("is a div with the base class and role dialog", () => {
        const { container } = render(Subject, {
            props: { label: "Info", children: textSnippet("C") },
        });
        const root = container.querySelector("div.popover") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("dialog");
        // Without the Popover API the fallback drops the popover attribute and uses hidden.
        expect(root.hasAttribute("popover")).toBe(false);
    });
    test("stays in the DOM when closed, so a commandfor trigger can name its id", () => {
        render(Subject, {
            props: { label: "Info", id: "info-popover", children: textSnippet("C") },
        });
        expect(document.getElementById("info-popover")).toBeTruthy();
    });
    test("renders children", () => {
        render(Subject, { props: { label: "I", open: true, children: textSnippet("Content") } });
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });
    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "I", open: true, "data-testid": "po", children: textSnippet("C") },
        });
        expect(screen.getByTestId("po")).toBeTruthy();
    });
});
