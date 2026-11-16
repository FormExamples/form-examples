<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VietNamCanCuocCongDanView from "./VietNamCanCuocCongDanView.svelte";

    const { Story } = defineMeta({
        title: "Headless/VietNamCanCuocCongDanView",
        component: VietNamCanCuocCongDanView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Citizen Identification Number (CCCD) View" }}
/>
