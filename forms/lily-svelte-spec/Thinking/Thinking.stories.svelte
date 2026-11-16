<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Thinking from "./Thinking.svelte";

    const { Story } = defineMeta({
        title: "Headless/Thinking",
        component: Thinking,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Thinking" }}
>
    <p>Reasoning steps appear here.</p>
</Story>
