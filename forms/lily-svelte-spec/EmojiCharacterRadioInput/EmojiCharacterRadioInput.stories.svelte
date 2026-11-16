<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EmojiCharacterRadioInput from "./EmojiCharacterRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/EmojiCharacterRadioInput",
        component: EmojiCharacterRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
