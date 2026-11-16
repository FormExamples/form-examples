<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CanadaSocialInsuranceNumberInput from "./CanadaSocialInsuranceNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/CanadaSocialInsuranceNumberInput",
        component: CanadaSocialInsuranceNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Social Insurance Number (SIN) Input" }}
/>
