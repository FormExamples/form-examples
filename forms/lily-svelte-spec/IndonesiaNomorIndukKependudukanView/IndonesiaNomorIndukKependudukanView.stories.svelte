<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IndonesiaNomorIndukKependudukanView from "./IndonesiaNomorIndukKependudukanView.svelte";

    const { Story } = defineMeta({
        title: "Headless/IndonesiaNomorIndukKependudukanView",
        component: IndonesiaNomorIndukKependudukanView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Nomor Induk Kependudukan (NIK) View" }}
/>
