<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sheet from './Sheet.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Sheet',
    component: Sheet,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sheet'}}
>
  <p>Panel content</p>
</Story>
