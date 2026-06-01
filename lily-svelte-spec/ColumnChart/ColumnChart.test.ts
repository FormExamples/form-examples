import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ColumnChart from "./ColumnChart.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("ColumnChart", () => {
    it("renders with class", () => {
        const { container } = render(ColumnChart, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".column-chart");
        expect(el).toBeTruthy();
    });
});
