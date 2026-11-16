<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ZhongguoJuminShenfenzhengHaomaInput from "./ZhongguoJuminShenfenzhengHaomaInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ZhongguoJuminShenfenzhengHaomaInput",
        component: ZhongguoJuminShenfenzhengHaomaInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ) Input" }}
/>
