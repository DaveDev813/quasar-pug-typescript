<template lang="pug">
  div
    p {{ title }}
    ul
      li(v-for='todo in todos' :key='todo.id' @click='increment')
        | {{ todo.id }} - {{ todo.content }}
    p Count: {{ todoCount }} / {{ meta.totalCount }}
    p Active: {{ active ? 'yes' : 'no' }}
    p Clicks on todos: {{ clickCount }}

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo, Meta } from './models';

interface Props {
  title: string;
  todos?: Todo[];
  meta: Meta;
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  todos: () => [],
});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}

const todoCount = computed(() => props.todos.length);
</script>
