<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BarcodeImage from "./BarcodeImage.svelte";
    const { Story } = defineMeta({
        title: "Headless/BarcodeImage",
        component: BarcodeImage,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <BarcodeImage src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='40'><rect width='160' height='40' fill='%23fff'/><g fill='%23000'>" alt="Order number 12345" />
</Story>
