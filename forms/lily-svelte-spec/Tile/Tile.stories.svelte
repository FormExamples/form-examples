<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Tile from "./Tile.svelte";
    const { Story } = defineMeta({
        title: "Headless/Tile",
        component: Tile,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Tile label="Tile example">
        <span>Tile example</span>
    </Tile>
</Story>
