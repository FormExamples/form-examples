import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChatMessage from "./ChatMessage.svelte";

describe("ChatMessage", () => {
    test("renders with content", () => {
        render(ChatMessage, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chat-message");
    });
});
