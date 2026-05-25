import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChatListItem from "./ChatListItem.svelte";

describe("ChatListItem", () => {
    test("renders with content", () => {
        render(ChatListItem, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chat-list-item");
    });
});
