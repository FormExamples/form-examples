<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MisrAlRaqmAlQawmiView from "./MisrAlRaqmAlQawmiView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MisrAlRaqmAlQawmiView",
        component: MisrAlRaqmAlQawmiView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "الرقم القومي (Al-Raqm Al-Qawmi) View" }}
/>
