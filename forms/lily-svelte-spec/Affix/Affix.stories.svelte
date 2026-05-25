<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Affix from './Affix.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Affix',
    component: Affix,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ offsetTop: 0 }}
>
  <span>Pinned to top</span>
</Story>
