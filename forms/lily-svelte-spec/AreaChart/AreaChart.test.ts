import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import AreaChart from "./AreaChart.svelte";

function svgSnippet() {
    return createRawSnippet(() => ({
        render: () => `<svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>`,
    }));
}

function tableSnippet() {
    return createRawSnippet(() => ({
        render: () =>
            `<table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>`,
    }));
}

describe("AreaChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(AreaChart, {
            props: { label: "Test", children: svgSnippet() },
        });
        expect(container.querySelector("figure.area-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(AreaChart, { props: { label: "Test", children: svgSnippet() } });
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("area-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("omits aria-label when no label is given", () => {
        const { container } = render(AreaChart, { props: { children: svgSnippet() } });
        expect(container.querySelector(".area-chart-graphic")!.hasAttribute("aria-label")).toBe(
            false,
        );
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(AreaChart, { props: { label: "T", children: svgSnippet() } });
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(AreaChart, {
            props: { label: "T", class: "mine", children: svgSnippet() },
        });
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("area-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(AreaChart, { props: { label: "T", children: svgSnippet() } });
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without a dataTable snippet", () => {
        const { container } = render(AreaChart, { props: { label: "T", children: svgSnippet() } });
        expect(container.querySelector(".area-chart-data-table")).toBeNull();
    });

    it("renders the dataTable snippet in a .area-chart-data-table sibling after the graphic", () => {
        const { container } = render(AreaChart, {
            props: { label: "T", children: svgSnippet(), dataTable: tableSnippet() },
        });
        const wrap = container.querySelector(".area-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".area-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(AreaChart, {
            props: { label: "T", children: svgSnippet(), dataTable: tableSnippet() },
        });
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(AreaChart, {
            props: { label: "T", id: "c1", "data-testid": "chart", children: svgSnippet() },
        });
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
