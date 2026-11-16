import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RedOrangeYellowGreenBlueView.svelte";

describe("RedOrangeYellowGreenBlueView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(el.tagName).toBe("SPAN");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Status"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("displays red status", () => {
        render(Subject, { props: { label: "Status", value: "red" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("red");
    });

    test("displays orange status", () => {
        render(Subject, { props: { label: "Status", value: "orange" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("orange");
    });

    test("displays yellow status", () => {
        render(Subject, { props: { label: "Status", value: "yellow" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("yellow");
    });

    test("displays green status", () => {
        render(Subject, { props: { label: "Status", value: "green" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("green");
    });

    test("displays blue status", () => {
        render(Subject, { props: { label: "Status", value: "blue" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("blue");
    });

    test("defaults to empty string when no value provided", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-orange-yellow-green-blue-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "roygb-view" } });

        expect(screen.getByTestId("roygb-view")).toBeTruthy();
    });
});
