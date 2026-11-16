import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./ImageCropper.svelte";

test("meets the cropper contract", async () => {
    const { container } = render(Subject, { props: { label: "Crop" } as never });
    await runPattern("cropper", {
        root: container.querySelector<HTMLElement>(".image-cropper")!,
        hook: "image-cropper",
    });
});
