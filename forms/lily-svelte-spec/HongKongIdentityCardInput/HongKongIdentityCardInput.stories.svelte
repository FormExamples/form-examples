<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HongKongIdentityCardInput from "./HongKongIdentityCardInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/HongKongIdentityCardInput",
        component: HongKongIdentityCardInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Hong Kong Identity Card Number Input" }}
/>
