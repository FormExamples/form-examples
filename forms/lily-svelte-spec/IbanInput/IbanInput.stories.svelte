<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IbanInput from "./IbanInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/IbanInput",
        component: IbanInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "IBAN Input" }}
/>
