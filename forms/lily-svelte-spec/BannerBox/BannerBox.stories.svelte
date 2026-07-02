<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BannerBox from './BannerBox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BannerBox',
    component: BannerBox,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Banner Box'}}
>
  <p>Banner message</p>
</Story>
