<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Picture from "./Picture.svelte";
    const { Story } = defineMeta({
        title: "Headless/Picture",
        component: Picture,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <Picture>
        <source
            srcset="wide.webp"
            media="(min-width: 800px)"
            type="image/webp"
        />
        <img
            src="small.jpg"
            alt="A lily in bloom"
            width="320"
            height="200"
        />
    </Picture>
</Story>
