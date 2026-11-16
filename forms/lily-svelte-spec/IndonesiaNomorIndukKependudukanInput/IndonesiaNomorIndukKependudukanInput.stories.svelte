<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IndonesiaNomorIndukKependudukanInput from "./IndonesiaNomorIndukKependudukanInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/IndonesiaNomorIndukKependudukanInput",
        component: IndonesiaNomorIndukKependudukanInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Nomor Induk Kependudukan (NIK) Input" }}
/>
