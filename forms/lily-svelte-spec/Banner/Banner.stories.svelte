<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Banner from './Banner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Banner',
    component: Banner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Banner message</p>
</Story>
