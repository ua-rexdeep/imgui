<template>
    <div class="absolute flex flex-col rounded-md text-white overflow-hidden select-none" :style="{
        width: width + 'px',
        height: height + 'px',
        top: gui.GetY() + 'px',
        left: gui.GetX() + 'px',
        zIndex: ZIndex,
    }" @mousedown="UpdateZIndex()">
        <div class="flex p-0.5 justify-between items-center" :style="{ background: gui.GetTitleBackground() }">
            <div class="flex items-center flex-1">
                <div class="w-4 h-4 rounded-full flex items-center cursor-pointer ml-0.5" @click="OnCollapseClick">
                    <i v-show="gui.IsCollapsed()" class="fa-solid fa-caret-right text-sm ml-1"></i>
                    <i v-show="!gui.IsCollapsed()" class="fa-solid fa-caret-down text-sm ml-1"></i>
                </div>

                <GUIContent :gui="gi" class="pl-1 cursor-move flex-1" @mousedown="SetIsMove(true)"
                    :content="{ type: 'text', object: gui.GetContent(), value: title }" />
            </div>
            <div class="w-4 h-4 rounded-full flex justify-center items-center mr-1 cursor-pointer"
                @click="ImGUI.DeleteByIdWithTrigger(gui.GetID())">
                <i class="fal fa-xmark text-xs"></i>
            </div>
        </div>
        <div class="bg-[#151617f3] rounded-b-md flex flex-col flex-1 p-1 overflow-x-hidden overflow-y-auto gap-1"
            v-show="!gui.IsCollapsed()">

            <GUIContent :gui="gui" :content="gui.GetContent()" />

        </div>

        <div class="resizeCorner" v-if="gui.IsResizeAllowed()" @mousedown="SetIsResize(true)"></div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { GUI } from '../services/gui';
import { UseImGUI } from '../store';
import GUIContent from './GUIContent.vue';
const props = defineProps(['gui']);
const ImGUI = UseImGUI();

const IsMoving = ref(false);
const IsResize = ref(false);
const StartMovePos = ref([0, 0]);
const StartMoveOffset = ref([0, 0]);

const StartZIndex = performance.now();
const ZIndex = ref(0);

const width = computed(() => props.gui.GetWidth());
const height = computed(() => props.gui.GetHeight());
const title = computed(() => props.gui.GetTitle());

console.warn(props.gui.GetContent())
function UpdateZIndex() {
    ZIndex.value = parseInt((performance.now() - StartZIndex) / 1000);
}

function OnCollapseClick() {
    props.gui.IsCollapsed() ? props.gui.Expand() : props.gui.Collapse();
}

function SetIsMove(state) {
    IsMoving.value = state;
    if (state) {
        StartMoveOffset.value = [StartMovePos.value[0] - props.gui.GetX(), StartMovePos.value[1] - props.gui.GetY()]
    }
}

function OnMouseMove(ev) {

    if (IsMoving.value) {
        let nextX = ev.clientX - StartMoveOffset.value[0];
        let nextY = ev.clientY - StartMoveOffset.value[1];
        if (nextX + props.gui.GetWidth() > window.innerWidth) nextX = window.innerWidth - props.gui.GetWidth();
        if (nextY + props.gui.GetHeight() > window.innerHeight) nextY = window.innerHeight - props.gui.GetHeight();

        if (nextY < 0) nextY = 0;
        if (nextX < 0) nextX = 0;
        props.gui.Move(nextX, nextY);
    } else if (IsResize.value) {
        let nextX = ev.clientX - props.gui.GetX() + 5;
        let nextY = ev.clientY - props.gui.GetY() + 5;

        if (props.gui.GetX() + nextX > window.innerWidth) nextX = window.innerWidth - props.gui.GetX();
        if (props.gui.GetY() + nextY > window.innerHeight) nextY = window.innerHeight - props.gui.GetY();

        if (nextX < GUI.MinWidth) nextX = GUI.MinWidth;
        if (nextY < GUI.MinHeight) nextY = GUI.MinHeight;

        props.gui.Resize(nextX, nextY);
    } else {
        StartMovePos.value = [ev.clientX, ev.clientY];
    }
}

function SetIsResize(state) {
    IsResize.value = state;
}

function OnMouseUP() {
    SetIsMove(false);
    SetIsResize(false);
}

onMounted(() => {
    window.addEventListener('mousemove', OnMouseMove);
    window.addEventListener('mouseup', OnMouseUP);
})

onUnmounted(() => {
    window.removeEventListener("mousemove", OnMouseMove);
    window.removeEventListener('mouseup', OnMouseUP);
})

</script>