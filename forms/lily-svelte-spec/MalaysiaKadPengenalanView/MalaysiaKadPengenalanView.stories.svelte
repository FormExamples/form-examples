<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MalaysiaKadPengenalanView from "./MalaysiaKadPengenalanView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MalaysiaKadPengenalanView",
        component: MalaysiaKadPengenalanView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "MyKad Number (NRIC) View" }}
/>
