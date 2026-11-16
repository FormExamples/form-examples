<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TuaisceartEireannHealthAndCareNumberInput from "./TuaisceartEireannHealthAndCareNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/TuaisceartEireannHealthAndCareNumberInput",
        component: TuaisceartEireannHealthAndCareNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Tuaisceart Eireann Health And Care Number Input" }}
/>
