<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EmptyState from "./EmptyState.svelte";

    const { Story } = defineMeta({
        title: "Headless/EmptyState",
        component: EmptyState,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "No results" }}
>
    <h2>No results</h2>
    <p>Try a different search.</p>
</Story>
