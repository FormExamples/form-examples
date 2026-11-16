<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IbanView from "./IbanView.svelte";

    const { Story } = defineMeta({
        title: "Headless/IbanView",
        component: IbanView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "IBAN View" }}
/>
