<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Citation from "./Citation.svelte";
    const { Story } = defineMeta({
        title: "Headless/Citation",
        component: Citation,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Citation label="Citation example">
        <span>Citation example</span>
    </Citation>
</Story>
