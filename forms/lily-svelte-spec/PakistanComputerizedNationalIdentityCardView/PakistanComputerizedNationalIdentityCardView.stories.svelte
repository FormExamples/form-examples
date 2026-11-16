<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PakistanComputerizedNationalIdentityCardView from "./PakistanComputerizedNationalIdentityCardView.svelte";

    const { Story } = defineMeta({
        title: "Headless/PakistanComputerizedNationalIdentityCardView",
        component: PakistanComputerizedNationalIdentityCardView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Computerized National Identity Card Number (CNIC) View" }}
/>
