import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Icon.svelte";
function textSnippet(text: string) { return (($$anchor: Comment) => { const node = document.createTextNode(text); $$anchor.before(node); }) as any; }
describe("Icon", () => {
    test("meaningful icon has img role", () => { render(Subject, { props: { label: "Close", children: textSnippet("×") } }); expect(screen.getByRole("img", { name: "Close" })).toBeTruthy(); });
    test("decorative icon is aria-hidden", () => { render(Subject, { props: { decorative: true, "data-testid": "ic", children: textSnippet("★") } }); expect(screen.getByTestId("ic").getAttribute("aria-hidden")).toBe("true"); });
    test("renders children", () => { render(Subject, { props: { label: "Star", children: textSnippet("★") } }); expect(screen.getByRole("img").textContent).toBe("★"); });
    test("passes through attributes", () => { render(Subject, { props: { label: "X", "data-testid": "ic", children: textSnippet("×") } }); expect(screen.getByTestId("ic")).toBeTruthy(); });
});
