<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EndNotes from './EndNotes.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EndNotes',
    component: EndNotes,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "End notes"
  }}
>
  <ol>
    <li>First endnote.</li>
    <li>Second endnote.</li>
  </ol>
</Story>
