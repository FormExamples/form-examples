import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import BarChart from "./BarChart.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("BarChart", () => {
    it("renders with class", () => {
        const { container } = render(BarChart, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".bar-chart");
        expect(el).toBeTruthy();
    });
});
