<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ZhongguoJuminShenfenzhengHaomaView from "./ZhongguoJuminShenfenzhengHaomaView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ZhongguoJuminShenfenzhengHaomaView",
        component: ZhongguoJuminShenfenzhengHaomaView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ) View" }}
/>
