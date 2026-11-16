<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import KyprosNationalPassportNumberView from "./KyprosNationalPassportNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/KyprosNationalPassportNumberView",
        component: KyprosNationalPassportNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Kypros National Passport Number View" }}
/>
