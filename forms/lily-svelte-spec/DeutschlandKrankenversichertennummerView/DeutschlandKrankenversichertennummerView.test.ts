import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DeutschlandKrankenversichertennummerView.svelte";

describe("DeutschlandKrankenversichertennummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Health Insurance Number", value: "test-value" } });

        const el = document.querySelector(
            ".deutschland-krankenversichertennummer-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("deutschland-krankenversichertennummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Health Insurance Number", value: "test-value" } });

        const el = document.querySelector(
            ".deutschland-krankenversichertennummer-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Health Insurance Number" } });

        const el = document.querySelector(
            ".deutschland-krankenversichertennummer-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Health Insurance Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
