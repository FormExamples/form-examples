import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Code from "./Code.svelte";

describe("Code", () => {
    test("renders with content", () => {
        render(Code, { props: {} as any });
        const el = document.querySelector(".code") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("code");
    });
});
