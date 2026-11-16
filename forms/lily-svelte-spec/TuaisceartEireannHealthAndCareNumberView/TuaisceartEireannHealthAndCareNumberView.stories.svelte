<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TuaisceartEireannHealthAndCareNumberView from "./TuaisceartEireannHealthAndCareNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/TuaisceartEireannHealthAndCareNumberView",
        component: TuaisceartEireannHealthAndCareNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Tuaisceart Eireann Health And Care Number View" }}
/>
