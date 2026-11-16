<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VietNamCanCuocCongDanInput from "./VietNamCanCuocCongDanInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/VietNamCanCuocCongDanInput",
        component: VietNamCanCuocCongDanInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Citizen Identification Number (CCCD) Input" }}
/>
