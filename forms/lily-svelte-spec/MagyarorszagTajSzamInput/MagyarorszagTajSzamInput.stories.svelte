<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MagyarorszagTajSzamInput from "./MagyarorszagTajSzamInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/MagyarorszagTajSzamInput",
        component: MagyarorszagTajSzamInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Társadalombiztosítási Azonosító Jel (TAJ) Input" }}
/>
