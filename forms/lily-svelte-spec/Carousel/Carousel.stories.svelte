<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Carousel from './Carousel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Carousel',
    component: Carousel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Carousel'}}
>
  <div>Slide 1</div><div>Slide 2</div>
</Story>
