<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HongKongIdentityCardView from "./HongKongIdentityCardView.svelte";

    const { Story } = defineMeta({
        title: "Headless/HongKongIdentityCardView",
        component: HongKongIdentityCardView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Hong Kong Identity Card Number View" }}
/>
