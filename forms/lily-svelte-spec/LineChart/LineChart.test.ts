import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import LineChart from "./LineChart.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("LineChart", () => {
    it("renders with class", () => {
        const { container } = render(LineChart, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".line-chart");
        expect(el).toBeTruthy();
    });
});
