import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChatNav from "./ChatNav.svelte";

describe("ChatNav", () => {
    test("renders with content", () => {
        render(ChatNav, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chat-nav");
    });
});
