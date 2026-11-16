<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TurkiyeTcKimlikNumarasiView from "./TurkiyeTcKimlikNumarasiView.svelte";

    const { Story } = defineMeta({
        title: "Headless/TurkiyeTcKimlikNumarasiView",
        component: TurkiyeTcKimlikNumarasiView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "T.C. Kimlik Numarası View" }}
/>
