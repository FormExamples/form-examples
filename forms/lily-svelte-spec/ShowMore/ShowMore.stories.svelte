<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ShowMore from "./ShowMore.svelte";

    const { Story } = defineMeta({
        title: "Headless/ShowMore",
        component: ShowMore,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ moreLabel: "Show more", lessLabel: "Show less" }}
>
    <p>A long paragraph that the consumer clamps with CSS until it is expanded.</p>
</Story>
