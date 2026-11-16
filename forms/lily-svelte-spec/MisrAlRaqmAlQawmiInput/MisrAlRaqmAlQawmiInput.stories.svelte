<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MisrAlRaqmAlQawmiInput from "./MisrAlRaqmAlQawmiInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/MisrAlRaqmAlQawmiInput",
        component: MisrAlRaqmAlQawmiInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "الرقم القومي (Al-Raqm Al-Qawmi) Input" }}
/>
