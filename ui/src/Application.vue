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

}, 100)

</script>