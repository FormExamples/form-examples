import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./AngleSliderRangeInput.svelte";

describe("AngleSliderRangeInput", () => {
    test("renders as a slider", () => {
        render(Subject, { props: {
            label: "Rotation",
        }});

        const slider: HTMLElement = screen.getByRole("slider", { name: "Rotation" });
        expect(slider).toBeTruthy();
    });

    test("defaults to value 0 with range 0-360", () => {
        render(Subject, { props: {
            label: "Angle",
        }});

        const slider: HTMLInputElement = screen.getByRole("slider") as HTMLInputElement;
        expect(slider.value).toBe("0");
        expect(slider.getAttribute("min")).toBe("0");
        expect(slider.getAttribute("max")).toBe("360");
    });

    test("accepts custom value", () => {
        render(Subject, { props: {
            label: "Angle",
            value: 90,
        }});

        const slider: HTMLInputElement = screen.getByRole("slider") as HTMLInputElement;
        expect(slider.value).toBe("90");
    });

    test("accepts custom min, max, and step", () => {
        render(Subject, { props: {
            label: "Angle",
            min: 0,
            max: 180,
            step: 15,
        }});

        const slider: HTMLInputElement = screen.getByRole("slider") as HTMLInputElement;
        expect(slider.getAttribute("min")).toBe("0");
        expect(slider.getAttribute("max")).toBe("180");
        expect(slider.getAttribute("step")).toBe("15");
    });

    test("has correct ARIA value attributes", () => {
        render(Subject, { props: {
            label: "Direction",
            value: 45,
            min: 0,
            max: 360,
        }});

        const slider: HTMLElement = screen.getByRole("slider");
        expect(slider.getAttribute("aria-valuemin")).toBe("0");
        expect(slider.getAttribute("aria-valuemax")).toBe("360");
        expect(slider.getAttribute("aria-valuenow")).toBe("45");
        expect(slider.getAttribute("aria-valuetext")).toBe("45°");
    });

    test("supports custom valueTextSuffix", () => {
        render(Subject, { props: {
            label: "Rotation",
            value: 180,
            valueTextSuffix: " degrees",
        }});

        const slider: HTMLElement = screen.getByRole("slider");
        expect(slider.getAttribute("aria-valuetext")).toBe("180 degrees");
    });

    test("applies aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Rotation angle",
        }});

        const slider: HTMLElement = screen.getByRole("slider", { name: "Rotation angle" });
        expect(slider).toBeTruthy();
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            label: "Angle",
            disabled: true,
        }});

        const slider: HTMLInputElement = screen.getByRole("slider") as HTMLInputElement;
        expect(slider.disabled).toBe(true);
    });

    test("applies name and id attributes", () => {
        render(Subject, { props: {
            label: "Angle",
            name: "rotation",
            id: "angle-input",
        }});

        const slider: HTMLElement = screen.getByRole("slider");
        expect(slider.getAttribute("name")).toBe("rotation");
        expect(slider.getAttribute("id")).toBe("angle-input");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Angle",
            "data-testid": "custom-slider",
        }});

        const slider: HTMLElement = screen.getByTestId("custom-slider");
        expect(slider).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            label: "Angle",
        }});

        const slider: HTMLElement = screen.getByRole("slider");
        await user.tab();
        expect(document.activeElement).toBe(slider);
    });
});
