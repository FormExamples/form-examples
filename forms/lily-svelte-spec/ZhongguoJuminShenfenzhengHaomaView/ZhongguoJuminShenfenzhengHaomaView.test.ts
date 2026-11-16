import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ZhongguoJuminShenfenzhengHaomaView.svelte";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)", value: "test-value" },
        });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("zhongguo-jumin-shenfenzheng-haoma-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)", value: "test-value" },
        });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" } });

        const el = document.querySelector(".zhongguo-jumin-shenfenzheng-haoma-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
