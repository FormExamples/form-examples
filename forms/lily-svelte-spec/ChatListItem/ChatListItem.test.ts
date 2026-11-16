import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChatListItem from "./ChatListItem.svelte";

describe("ChatListItem", () => {
    test("renders with content", () => {
        render(ChatListItem, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chat-list-item");
    });

    test("is an <li>, with aria-current only when current", () => {
        const { container, rerender } = render(ChatListItem, { props: { label: "Ana" } as any });
        const el = container.querySelector(".chat-list-item")!;
        expect(el.tagName).toBe("LI");
        expect(el.hasAttribute("aria-current")).toBe(false);
        return rerender({ label: "Ana", current: true } as any).then(() => {
            expect(container.querySelector(".chat-list-item")!.getAttribute("aria-current")).toBe(
                "true",
            );
        });
    });
});
