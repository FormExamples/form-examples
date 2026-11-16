<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import KyprosNationalPassportNumberInput from "./KyprosNationalPassportNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/KyprosNationalPassportNumberInput",
        component: KyprosNationalPassportNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Kypros National Passport Number Input" }}
/>
