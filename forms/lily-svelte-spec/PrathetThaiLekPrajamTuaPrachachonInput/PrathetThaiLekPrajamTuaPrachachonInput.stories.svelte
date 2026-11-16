<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PrathetThaiLekPrajamTuaPrachachonInput from "./PrathetThaiLekPrajamTuaPrachachonInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/PrathetThaiLekPrajamTuaPrachachonInput",
        component: PrathetThaiLekPrajamTuaPrachachonInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon) Input" }}
/>
