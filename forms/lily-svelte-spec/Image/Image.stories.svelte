<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Image from "./Image.svelte";

    const { Story } = defineMeta({
        title: "Headless/Image",
        component: Image,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ src: "https://placehold.co/400x250", alt: "A sunset over the ocean" }}
/>
