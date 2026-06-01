<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Diff from "./Diff.svelte";
    const { Story } = defineMeta({
        title: "Headless/Diff",
        component: Diff,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Diff label="Diff example">
        <span>Diff example</span>
    </Diff>
</Story>
