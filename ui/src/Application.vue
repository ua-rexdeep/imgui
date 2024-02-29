<template>
    <div id="imgui" class="w-full h-full"
        :class="{ ProggyClean: ImGUI.font == 'proggy', RobotoMedium: ImGUI.font == 'roboto' }">
        <GUI v-for="gui of ImGUI.GetAll()" :key="gui.GetID()" :gui="gui" />
    </div>
</template>

<script setup>
import GUI from './components/GUI.vue';
import { API } from './services/api';
import { UseImGUI } from './store';

const api = new API();
const ImGUI = UseImGUI();

// axios.get("http://localhost:3000").then(({ data }) => {
//     if (!ImGUI.GetById(data.id)) ImGUI.CreateGUI(data.id, data);
// });

window.addEventListener('keydown', ({ key, altKey }) => {
    if (key == 'd' && altKey) {
        ImGUI.Log('GUI unfocus keybind triggered.');
        api.TurnNUIFocusOff();
    }
});

setTimeout(() => {

    console.log("RUN")

    if (!ImGUI.GetById("__web_settings__")) ImGUI.CreateGUI("__web_settings__", {
        title: "ImGUI Settings",
        width: 260,
        height: 220,
        contents: [
            {
                type: 'horizontal',
                content: [
                    {
                        type: 'text',
                        value: 'Font:'
                    },
                    {
                        type: 'select',
                        options: [
                            { key: 'proggy', value: 'Proggy Clean 13px' },
                            { key: 'roboto', value: 'Roboto Medium 16px' },
                        ],
                        value: 'proggy',
                        width: 80,
                        id: 'fontSelect'
                    }
                ]
            },
            {
                type: 'horizontal',
                content: [
                    {
                        type: 'text',
                        value: 'Hide gui when not focused?'
                    },
                    {
                        type: 'check',
                        value: false,
                        id: 'hideGuiWhenNotFocused',
                    }
                ],
            },
            {
                type: 'horizontal',
                content: [
                    {
                        type: 'text',
                        value: `LocalStorage items: ${localStorage.length}`
                    },
                    {
                        type: 'button',
                        text: 'Clear',
                        id: 'clearLocalStorage',
                    }
                ],
            }
        ]
    });


    if (!ImGUI.GetById("Console")) {
        ImGUI.CreateGUI("Console", {
            title: "Console",
            width: 460,
            height: 320,
            resize: false,
            contents: [
                {
                    type: 'vertical',
                    id: 'consoleLogs',
                    height: 93,
                    content: [],
                    reverseScroll: true,
                },
                { type: 'input', width: 100, id: 'consoleInput', onEnter: true },
            ],
        });
        ImGUI.Log('Start.')
    }



    if (!ImGUI.GetById("Vehicle")) ImGUI.CreateGUI("Vehicle", {
        title: "Vehicle: 293648 | Network: %lime%28",
        width: 460,
        height: 320,
        resize: false,
        contents: [
            { type: 'text', value: 'Model: POLICE3', object: {} },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'XYZ:' },
                    { type: 'text', value: '1.28, 1027.28, 0.23', userSelect: true },
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'Distance: 24.1 (0km)' },
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'Rotation(order 2):' },
                    {
                        type: 'vertical',
                        width: 50,
                        content: [
                            { type: 'float', value: 0, min: 0, max: 380, step: 0.01, override: 'X: %' },
                            { type: 'float', value: 0, min: 0, max: 380, step: 0.01, override: 'Y: %' },
                            { type: 'float', value: 0, min: 0, max: 380, step: 0.01, override: 'Z: %' },
                        ]
                    }
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'Freeze:' },
                    { type: 'check', checked: false },
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'DrawLine:' },
                    { type: 'check', checked: false },
                    { type: 'float', width: 25, value: 0, min: 0, max: 255, step: 1, override: 'R: %' },
                    { type: 'float', width: 25, value: 0, min: 0, max: 255, step: 1, override: 'G: %' },
                    { type: 'float', width: 25, value: 0, min: 0, max: 255, step: 1, override: 'B: %' },
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'Plate number:' },
                    { type: 'input', value: 'AA0000AA' },
                ]
            },
            {
                type: 'horizontal',
                content: [
                    { type: 'text', value: 'Fuel level:' },
                    { type: 'float', width: 50, value: 0, min: 0, max: 64, step: 0.01, override: '%L / 64L' },
                ]
            },
            { type: 'divider' },
            {
                type: 'horizontal',
                content: [
                    { type: 'button', text: 'Warp into vehicle' },
                    { type: 'button', text: 'Warp to me' },
                    { type: 'button', text: 'DELETE', style: 'error' },
                ]
            }
        ],
    });

}, 100)

</script>