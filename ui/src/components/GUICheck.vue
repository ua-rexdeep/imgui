<template>
    <div class="w-4 h-4 bg-second border border-gray-500 flex items-center justify-center" @click="OnClick">
        <i class="fal fa-check text-xs" v-show="content.checked" />
    </div>
</template>

<script setup>
const props = defineProps(['gui', 'content']);

function OnClick() {
    props.content.checked = !props.content.checked;
    props.gui.OnAction(props.content.id, 'change', props.content.checked);
}
</script>