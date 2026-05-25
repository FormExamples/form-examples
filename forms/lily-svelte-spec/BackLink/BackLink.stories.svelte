<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BackLink from './BackLink.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BackLink',
    component: BackLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Back Link','href':'#'}}
>
  <span>Link text</span>
</Story>
