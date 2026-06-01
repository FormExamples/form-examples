<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Place from "./Place.svelte";
    const { Story } = defineMeta({
        title: "Headless/Place",
        component: Place,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Place label="Place example">
        <span>Place example</span>
    </Place>
</Story>
