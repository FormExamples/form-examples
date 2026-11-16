<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SingaporeNationalRegistrationIdentityCardInput from "./SingaporeNationalRegistrationIdentityCardInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/SingaporeNationalRegistrationIdentityCardInput",
        component: SingaporeNationalRegistrationIdentityCardInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        label: "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN) Input",
    }}
/>
