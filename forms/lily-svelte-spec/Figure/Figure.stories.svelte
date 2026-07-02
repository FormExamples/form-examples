<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Figure from './Figure.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Figure',
    component: Figure,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Figure'}}
>
  <img src="" alt="Figure" /><figcaption>Caption</figcaption>
</Story>
