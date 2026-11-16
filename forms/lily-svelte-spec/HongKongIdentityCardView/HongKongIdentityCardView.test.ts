import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HongKongIdentityCardView.svelte";

describe("HongKongIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Hong Kong Identity Card Number", value: "test-value" },
        });

        const el = document.querySelector(".hong-kong-identity-card-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hong-kong-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Hong Kong Identity Card Number", value: "test-value" },
        });

        const el = document.querySelector(".hong-kong-identity-card-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Hong Kong Identity Card Number" } });

        const el = document.querySelector(".hong-kong-identity-card-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Hong Kong Identity Card Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
