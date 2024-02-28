<template>
    <div class="relative bg-second border border-gray-500 h-5 w-full" :style="{
        width: computeSize(content.width),
        height: computeSize(content.height),
        padding: `0 ${width / 2}px`
    }" @mousedown="SetMouseMove(true)" ref="floatRef">
        <div class="h-full min-w-4 bg-second-active relative -translate-x-1/2"
            :style="{ left: left + '%', width: width + 'px' }"></div>
        <div class="absolute w-full h-full left-0 top-0 flex items-center justify-center">{{ override }}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { computeSize } from '../utils';

const props = defineProps(['gui', 'content']);
const IsMouseMove = ref(false);
const MousePos = ref({ x: 0, y: 0 });
const floatRef = ref();

const min = computed(() => props.content.min || 0);
const max = computed(() => props.content.max || 1);
const step = computed(() => props.content.step || 0.1);
const width = computed(() => {
    const rect = floatRef.value?.getBoundingClientRect() || {};
    const fWidth = rect.width / ((max.value - min.value) / step.value);
    return fWidth < 16 ? 16 : fWidth;
});
const override = computed(() => {
    if (props.content.override) return props.content.override.replace('%', props.content.value.toFixed(step.value.toString().split('.').at(1)?.length || 0));
    else return props.content.value.toFixed(step.value.toString().split('.').at(1)?.length || 0);
})

const left = computed(() => props.content.value / max.value * 100);

function SetMouseMove(state) {
    IsMouseMove.value = state;
}

function OnMouseMove({ x, y }) {
    MousePos.value = { x, y };

    if (IsMouseMove.value) {
        const rect = floatRef.value.getBoundingClientRect();
        let percent = 100 * (x - rect.x) / rect.width;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        const value = (max.value - min.value) * (percent / 100);

        const nearest = findNearestStep(min.value, max.value, step.value, value);

        if (props.content.value != nearest) {
            props.gui.OnAction(props.content.id, 'change', nearest)
            props.content.value = nearest;
        }

    }
}

function findNearestStep(min, max, step, target) {
    if (target < min) {
        return min;
    } else if (target > max) {
        return max;
    }

    var steps = Math.round((target - min) / step);
    return steps * step;
}

onMounted(() => {
    window.addEventListener('mousemove', OnMouseMove);
    window.addEventListener('mouseup', SetMouseMove.bind(this, false));
})

onUnmounted(() => {
    window.removeEventListener('mousemove', OnMouseMove)
    window.removeEventListener('mouseup', SetMouseMove.bind(this, false))
})

</script>