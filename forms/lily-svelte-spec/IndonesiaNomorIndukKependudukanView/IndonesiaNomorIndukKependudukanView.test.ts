import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IndonesiaNomorIndukKependudukanView.svelte";

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Nomor Induk Kependudukan (NIK)", value: "test-value" },
        });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Nomor Induk Kependudukan (NIK)", value: "test-value" },
        });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Nomor Induk Kependudukan (NIK)" } });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Nomor Induk Kependudukan (NIK)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
