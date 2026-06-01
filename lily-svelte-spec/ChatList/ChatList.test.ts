import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChatList from "./ChatList.svelte";

describe("ChatList", () => {
    test("renders with content", () => {
        render(ChatList, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chat-list");
    });
});
