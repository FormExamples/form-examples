<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Mark from "./Mark.svelte";
    const { Story } = defineMeta({
        title: "Headless/Mark",
        component: Mark,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <Mark label="Mark example">
        <span>Mark example</span>
    </Mark>
</Story>
