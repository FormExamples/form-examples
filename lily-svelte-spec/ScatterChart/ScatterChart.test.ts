import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ScatterChart from "./ScatterChart.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("ScatterChart", () => {
    it("renders with class", () => {
        const { container } = render(ScatterChart, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".scatter-chart");
        expect(el).toBeTruthy();
    });
});
