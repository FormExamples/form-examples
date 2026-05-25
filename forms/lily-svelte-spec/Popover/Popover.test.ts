import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Popover.svelte";
function textSnippet(text: string) { return (($$anchor: Comment) => { const node = document.createTextNode(text); $$anchor.before(node); }) as any; }
describe("Popover", () => {
    test("hidden when closed", () => { render(Subject, { props: { label: "Info", open: false, children: textSnippet("C") } }); expect(screen.queryByRole("dialog")).toBeNull(); });
    test("visible when open", () => { render(Subject, { props: { label: "Info", open: true, children: textSnippet("C") } }); expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy(); });
    test("renders children", () => { render(Subject, { props: { label: "I", open: true, children: textSnippet("Content") } }); expect(screen.getByRole("dialog").textContent).toContain("Content"); });
    test("passes through attributes", () => { render(Subject, { props: { label: "I", open: true, "data-testid": "po", children: textSnippet("C") } }); expect(screen.getByTestId("po")).toBeTruthy(); });
});
