import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Sparkline.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("Sparkline", () => {
    test("renders img role", () => { render(Subject, { props: { label: "Trend", children: textSnippet("chart") } }); expect(screen.getByRole("img")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Price trend", children: textSnippet("chart") } }); expect(screen.getByLabelText("Price trend")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "S", "data-testid": "sl", children: textSnippet("x") } }); expect(screen.getByTestId("sl")).toBeTruthy(); });
});
