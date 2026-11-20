import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Sparkline.svelte";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("Sparkline", () => {
    test("renders img role", () => {
        render(Subject, { props: { label: "Trend", children: textSnippet("chart") } });
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Price trend", children: textSnippet("chart") } });
        expect(screen.getByLabelText("Price trend")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sl", children: textSnippet("x") } });
        expect(screen.getByTestId("sl")).toBeTruthy();
    });

    test("below minimumPoints it shows the consumer's words as text, not the graphic", () => {
        const { container } = render(Subject, {
            props: {
                label: "Weight trend",
                pointCount: 2,
                minimumPoints: 3,
                insufficientLabel: "Not enough readings for a trend",
                children: textSnippet("chart"),
            },
        });
        const root = container.querySelector(".sparkline") as HTMLElement;
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.hasAttribute("aria-label")).toBe(false);
        expect(root.textContent).not.toContain("chart");
        expect(root.querySelector(".sparkline-insufficient")?.textContent).toBe(
            "Not enough readings for a trend",
        );
    });

    test("at or above minimumPoints it draws the graphic as an image", () => {
        const { container } = render(Subject, {
            props: {
                label: "Weight trend",
                pointCount: 3,
                minimumPoints: 3,
                insufficientLabel: "Not enough readings for a trend",
                children: textSnippet("chart"),
            },
        });
        const root = container.querySelector(".sparkline") as HTMLElement;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.hasAttribute("data-insufficient")).toBe(false);
        expect(root.textContent).toContain("chart");
    });
});
