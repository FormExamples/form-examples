<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SingaporeNationalRegistrationIdentityCardView from "./SingaporeNationalRegistrationIdentityCardView.svelte";

    const { Story } = defineMeta({
        title: "Headless/SingaporeNationalRegistrationIdentityCardView",
        component: SingaporeNationalRegistrationIdentityCardView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        label: "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN) View",
    }}
/>
