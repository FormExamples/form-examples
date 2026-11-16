<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BharatAadhaarView from "./BharatAadhaarView.svelte";

    const { Story } = defineMeta({
        title: "Headless/BharatAadhaarView",
        component: BharatAadhaarView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Aadhaar (आधार) View" }}
/>
