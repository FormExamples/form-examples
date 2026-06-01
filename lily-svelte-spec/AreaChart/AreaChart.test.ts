import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import AreaChart from "./AreaChart.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("AreaChart", () => {
    it("renders with class", () => {
        const { container } = render(AreaChart, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".area-chart");
        expect(el).toBeTruthy();
    });
});
