<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TurkiyeTcKimlikNumarasiInput from "./TurkiyeTcKimlikNumarasiInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/TurkiyeTcKimlikNumarasiInput",
        component: TurkiyeTcKimlikNumarasiInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "T.C. Kimlik Numarası Input" }}
/>
