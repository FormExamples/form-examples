<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Draft from "./Draft.svelte";
    const { Story } = defineMeta({
        title: "Headless/Draft",
        component: Draft,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Draft label="Draft article" status="in-progress">
        <span>Working title — opening paragraph still needs a hook.</span>
    </Draft>
</Story>
