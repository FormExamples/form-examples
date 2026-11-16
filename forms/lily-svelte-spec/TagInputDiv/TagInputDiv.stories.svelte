<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TagInputDiv from "./TagInputDiv.svelte";

    const { Story } = defineMeta({
        title: "Headless/TagInputDiv",
        component: TagInputDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Tag Input" }}
/>
