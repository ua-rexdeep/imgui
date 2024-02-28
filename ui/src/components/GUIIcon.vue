<template>
    <i :class="[content.icon, `text-${typeof (content.size) == 'string' ? content.size : null}`]"
        :style="{ fontSize: typeof (content.size) == 'number' ? content.size : null }" />
</template>

<script setup>
defineProps(['content'])
</script>