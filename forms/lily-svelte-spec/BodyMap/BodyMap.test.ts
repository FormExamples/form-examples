import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet, flushSync } from "svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BodyMap.svelte";

const regions = [
    { id: "head", label: "Head" },
    { id: "left-arm", label: "Left arm" },
];
const drawing = createRawSnippet(() => ({
    render: () =>
        '<svg viewBox="0 0 10 10"><circle data-region="head" r="2" cx="5" cy="2"></circle><rect data-region="left-arm" x="0" y="4" width="2" height="4"></rect></svg>',
}));

describe("BodyMap", () => {
    test("is a fieldset named by its legend, its drawing hidden, its regions checkboxes", () => {
        render(Subject, { props: { label: "Where is the pain?", regions, children: drawing } });
        const group = screen.getByRole("group", { name: "Where is the pain?" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.querySelector(".body-map-figure")?.getAttribute("aria-hidden")).toBe("true");
        expect(screen.getAllByRole("checkbox").map((c) => c.getAttribute("value"))).toEqual([
            "head",
            "left-arm",
        ]);
        expect(screen.getByRole("checkbox", { name: "Head" })).toBeTruthy();
    });

    test("Space toggles a region, and the drawing shows it", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Where is the pain?", regions, children: drawing } });
        const head = screen.getByRole("checkbox", { name: "Head" }) as HTMLInputElement;
        head.focus();
        await user.keyboard(" ");
        expect(head.checked).toBe(true);
        expect(
            document.querySelector('circle[data-region="head"]')?.getAttribute("data-selected"),
        ).toBe("true");
        await user.keyboard(" ");
        expect(head.checked).toBe(false);
        expect(
            document.querySelector('circle[data-region="head"]')?.hasAttribute("data-selected"),
        ).toBe(false);
    });

    test("a click on a drawing shape toggles its region", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Where is the pain?", regions, children: drawing } });
        await user.click(document.querySelector('rect[data-region="left-arm"]') as Element);
        flushSync();
        expect(
            (screen.getByRole("checkbox", { name: "Left arm" }) as HTMLInputElement).checked,
        ).toBe(true);
    });

    test("chosen regions submit with the form under name", () => {
        render(Subject, {
            props: { label: "Where is the pain?", regions, selected: ["head"], name: "sites" },
        });
        const form = document.createElement("form");
        form.append(document.querySelector(".body-map") as Element);
        expect(new FormData(form).getAll("sites")).toEqual(["head"]);
    });
});
