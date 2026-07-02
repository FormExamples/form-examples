<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Kbd from "./Kbd.svelte";
    const { Story } = defineMeta({
        title: "Headless/Kbd",
        component: Kbd,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Kbd label="Kbd example">
        <span>Kbd example</span>
    </Kbd>
</Story>
