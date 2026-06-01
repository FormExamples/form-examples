<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ScrollerBase from './ScrollerBase.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ScrollerBase',
    component: ScrollerBase,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Scroll tracker"
  }}
>
  <section><p>Step 1</p></section>
  <section><p>Step 2</p></section>
  <section><p>Step 3</p></section>
</Story>
