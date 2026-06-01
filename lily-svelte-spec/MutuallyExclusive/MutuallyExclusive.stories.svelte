<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MutuallyExclusive from './MutuallyExclusive.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MutuallyExclusive',
    component: MutuallyExclusive,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'MutuallyExclusive'}}
>
  <span>MutuallyExclusive</span>
</Story>
