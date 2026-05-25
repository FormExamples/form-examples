import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Sonner.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("Sonner", () => {
    test("renders a region", () => { render(Subject, { props: { label: "Notifications", children: textSnippet("toast") } }); expect(screen.getByRole("region")).toBeTruthy(); });
    test("has aria-live", () => { render(Subject, { props: { label: "Notifications", children: textSnippet("toast") } }); expect(screen.getByRole("region").getAttribute("aria-live")).toBe("polite"); });
    test("passes through attributes", () => { render(Subject, { props: { label: "N", "data-testid": "sn", children: textSnippet("x") } }); expect(screen.getByTestId("sn")).toBeTruthy(); });
});
