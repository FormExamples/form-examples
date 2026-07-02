<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Scroller from './Scroller.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Scroller',
    component: Scroller,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Scrollytelling demo"
  }}
>
  {#snippet background()}
    <div style="position: sticky; top: 0; height: 100vh; display: grid; place-items: center; background: #eef;">
      Background graphic
    </div>
  {/snippet}
  <section><p>Step 1</p></section>
  <section><p>Step 2</p></section>
  <section><p>Step 3</p></section>
</Story>
