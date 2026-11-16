<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CanadaSocialInsuranceNumberView from "./CanadaSocialInsuranceNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/CanadaSocialInsuranceNumberView",
        component: CanadaSocialInsuranceNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Social Insurance Number (SIN) View" }}
/>
