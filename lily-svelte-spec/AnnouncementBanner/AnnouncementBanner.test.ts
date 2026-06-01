import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import AnnouncementBanner from "./AnnouncementBanner.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("AnnouncementBanner", () => {
    it("renders with class", () => {
        const { container } = render(AnnouncementBanner, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".announcement-banner");
        expect(el).toBeTruthy();
    });
});
