<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PakistanComputerizedNationalIdentityCardInput from "./PakistanComputerizedNationalIdentityCardInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/PakistanComputerizedNationalIdentityCardInput",
        component: PakistanComputerizedNationalIdentityCardInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Computerized National Identity Card Number (CNIC) Input" }}
/>
