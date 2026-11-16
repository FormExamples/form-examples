import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import ChatComposer from "./ChatComposer.svelte";

const LABELS = { label: "Message", sendLabel: "Send", stopLabel: "Stop" };
const setup = (props: Record<string, unknown> = {}) => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    const r = render(ChatComposer, { props: { ...LABELS, onSend, onStop, ...props } });
    const ta = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    return { ...r, ta, onSend, onStop };
};
const type = (ta: HTMLTextAreaElement, text: string) =>
    fireEvent.input(ta, { target: { value: text } });

describe("ChatComposer", () => {
    it("renders a <form> with the base class, a named textarea and one button", () => {
        const { container, ta } = setup();
        expect(container.querySelector("form.chat-composer")).toBeTruthy();
        expect(ta.classList.contains("chat-composer-input")).toBe(true);
        expect(container.querySelectorAll("button").length).toBe(1);
    });

    it("the button is the send button: type=submit, data-state=send, named by sendLabel", () => {
        const { container } = setup();
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("submit");
        expect(b.getAttribute("data-state")).toBe("send");
        expect(screen.getByRole("button", { name: "Send" })).toBe(b);
    });

    it("the send button is disabled, not hidden, while the text is empty or whitespace", async () => {
        const { ta, container } = setup();
        const b = container.querySelector("button")!;
        expect(b.disabled).toBe(true);
        await type(ta, "   ");
        expect(b.disabled).toBe(true);
        await type(ta, "hi");
        expect(b.disabled).toBe(false);
    });

    it("Enter sends the value and prevents the line break", async () => {
        const { ta, onSend } = setup();
        await type(ta, "hello");
        const notPrevented = await fireEvent.keyDown(ta, { key: "Enter" });
        expect(onSend).toHaveBeenCalledWith("hello");
        expect(notPrevented).toBe(false);
    });

    it("Shift+Enter does not send (it inserts a line break)", async () => {
        const { ta, onSend } = setup();
        await type(ta, "hello");
        const notPrevented = await fireEvent.keyDown(ta, { key: "Enter", shiftKey: true });
        expect(onSend).not.toHaveBeenCalled();
        expect(notPrevented).toBe(true);
    });

    it("Enter during IME composition does not send", async () => {
        const { ta, onSend } = setup();
        await type(ta, "こん");
        await fireEvent.keyDown(ta, { key: "Enter", isComposing: true });
        expect(onSend).not.toHaveBeenCalled();
    });

    it("Enter on empty text or when disabled does not send", async () => {
        const a = setup();
        await fireEvent.keyDown(a.ta, { key: "Enter" });
        expect(a.onSend).not.toHaveBeenCalled();
        a.unmount();
        const b = setup({ value: "hi", disabled: true });
        await fireEvent.keyDown(b.ta, { key: "Enter" });
        expect(b.onSend).not.toHaveBeenCalled();
    });

    it("submitting the form (the send button) sends", async () => {
        const { ta, container, onSend } = setup();
        await type(ta, "hello");
        await fireEvent.submit(container.querySelector("form")!);
        expect(onSend).toHaveBeenCalledWith("hello");
    });

    it("while busy the same button becomes stop: type=button, data-state=stop, named by stopLabel", () => {
        const { container } = setup({ busy: true, value: "x" });
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("button");
        expect(b.getAttribute("data-state")).toBe("stop");
        expect(screen.getByRole("button", { name: "Stop" })).toBe(b);
        expect(b.disabled).toBe(false);
    });

    it("pressing stop calls onStop and never onSend; Enter while busy does not send", async () => {
        const { container, ta, onSend, onStop } = setup({ busy: true, value: "x" });
        await fireEvent.click(container.querySelector("button")!);
        expect(onStop).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(ta, { key: "Enter" });
        expect(onSend).not.toHaveBeenCalled();
    });

    it("rows follow the number of lines, clamped to minRows and maxRows", async () => {
        const { ta } = setup({ minRows: 2, maxRows: 4 });
        expect(ta.rows).toBe(2);
        await type(ta, "a\nb\nc");
        expect(ta.rows).toBe(3);
        await type(ta, "a\nb\nc\nd\ne\nf");
        expect(ta.rows).toBe(4);
    });

    it("disabled disables the textarea and the button", () => {
        const { ta, container } = setup({ disabled: true, value: "x" });
        expect(ta.disabled).toBe(true);
        expect(container.querySelector("button")!.disabled).toBe(true);
    });

    it("passes placeholder and name to the textarea", () => {
        const { ta } = setup({ placeholder: "Ask", name: "msg" });
        expect(ta.placeholder).toBe("Ask");
        expect(ta.name).toBe("msg");
    });

    it("an initial value fills the textarea, and typing updates it", async () => {
        const { ta } = setup({ value: "hi" });
        expect(ta.value).toBe("hi");
        await type(ta, "hello");
        expect(ta.value).toBe("hello");
    });

    it("appends the consumer class after the base class and spreads rest props on the form", () => {
        const { container } = setup({ class: "mine", id: "cc1" });
        const f = container.querySelector("form")!;
        expect(f.getAttribute("class")).toBe("chat-composer mine");
        expect(f.id).toBe("cc1");
    });
});
