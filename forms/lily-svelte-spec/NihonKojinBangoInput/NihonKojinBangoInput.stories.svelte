<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NihonKojinBangoInput from "./NihonKojinBangoInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/NihonKojinBangoInput",
        component: NihonKojinBangoInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Individual Number / My Number (マイナンバー) Input" }}
/>
