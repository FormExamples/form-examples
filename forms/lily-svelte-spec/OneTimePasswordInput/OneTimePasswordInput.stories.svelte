<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OneTimePasswordInput from "./OneTimePasswordInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/OneTimePasswordInput",
        component: OneTimePasswordInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Verification code", length: 6 }}
/>
