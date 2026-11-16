<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MagyarorszagTajSzamView from "./MagyarorszagTajSzamView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MagyarorszagTajSzamView",
        component: MagyarorszagTajSzamView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Társadalombiztosítási Azonosító Jel (TAJ) View" }}
/>
