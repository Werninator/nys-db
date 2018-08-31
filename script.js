(function() {
    'use strict';

    new Vue({
        name: 'NYS DATABASE',
        el: '#app',
        data: function() {
            var data = {
                words: [],
                buffs: [],
                entities: [],
                encounters: [],
                places: [],
                quests: [],
            };

            if (localStorage.getItem('nysDb'))
                data = JSON.parse(localStorage.getItem('nysDb'));

            return {
                page: 'entities',
                pages: [
                    { key: 'home', name: 'Startseite' },
                    { key: 'words', name: 'Wörter' },
                    { key: 'buffs', name: 'Buffs' },
                    { key: 'entities', name: 'Entitäten' },
                ],
                effectTypes: {
                    damage: 'Schaden',
                    heal: 'Heilung',
                    buff: 'Buff',
                },
                elementTypes: {
                    fire: 'Feuer',
                    water: 'Wasser',
                    earth: 'Erde',
                    wind: 'Wind',
                },
                targets: {
                    self: 'Selbst',
                    team: 'Team',
                    single: 'Gegner (Einzeln)',
                    aoe: 'Gegner (Alle)',
                },
                detailItem: null,
                data: data,
            };
        },
        mounted: function() {
            // auto save
            setInterval(this.saveToBrowser, 60 * 1000);
            // show db after loading
            document.getElementById('app').style = '';
        },
        methods: {
            // general methods
            saveToBrowser: function() {
                this.forceUpdate();

                var vm = this;

                setTimeout(function() {
                    localStorage.setItem('nysDb', JSON.stringify(vm.data));
                }, 100);
            },
            changePage: function(page) {
                this.page = page;
            },
            onLoadClick: function() {
                this.$refs.file.click();
            },
            onFileLoad: function() {
                var vm = this;
                var files = this.$refs.file.files;
                var fr = new FileReader();

                fr.onload = function(e) {
                    vm.data = JSON.parse(e.target.result);
                    vm.saveToBrowser();
                    vm.page = 'home'
                    vm.$refs.file.value = '';
                };

                fr.readAsText(files.item(0));
            },
            forceUpdate: function() {
                this.data = JSON.parse(JSON.stringify(this.data));
            },
            swap: function(prop, pos1, pos2) {
                this.swapArray(this.data[prop], pos1, pos2);
            },
            swapArray: function(arr, pos1, pos2) {
                var toSwap = arr[pos1];
                arr[pos1] = arr[pos2];
                arr[pos2] = toSwap;
                this.forceUpdate();
            },
            remove: function(prop, el) {
                var index = this.data[prop].indexOf(el);
                if (~index) this.data[prop].splice(index, 1);
            },
            duplicate: function(prop, i) {
                this.duplicateArray(this.data[prop], i);
            },
            duplicateArray: function(arr, i) {
                arr.push(JSON.parse(JSON.stringify(arr[i])));
                this.swapArray(arr, arr.length - 1, i + 1);
            },
            // data methods
            // WORD
            addWord: function() {
                this.data.words.push({
                    id: this.data.words.length + 1,
                    element: null,
                    name: '',
                    effects: [],
                    manipulators: [],
                    powScaling: 0.5,
                    finisherTarget: 'single',
                });
            },
            addEffect: function(word) {
                word.effects.push({ type: null, buff: null, expert: false });
            },
            addManipulator: function(word) {
                word.manipulators.push({
                    type: null,
                    buff: null,
                    expert: false,
                });
            },
            // BUFF
            addBuff: function() {
                this.data.buffs.push({
                    id: this.data.buffs.length + 1,
                    name: '',
                    duration: 1,
                    stackable: false,
                    powScaling: 0.1,
                    onTick: { type: null, buff: null },
                    onEnd: { type: null, buff: null },
                    onStack: [],
                });
            },
            addStackEffect: function(buff) {
                buff.onStack.push({ threshold: 1, type: null, buff: null });
            },
            // ENTITY
            addEntity: function() {
                this.data.entities.push({
                    id: this.data.entities.length + 1,
                    name: '',
                    hp: 0,
                    power: 0,
                    elementalPower: {
                        fire: 10,
                        water: 10,
                        earth: 10,
                        wind: 10,
                    },
                    knowledge: [],
                    tactics: [],
                    inventory: [],
                });
            },
            editEntityKnowledge: function(entity) {
                this.detailItem = entity;
                this.page = 'entityKnowledge';
            },
            editEntityInventory: function(entity) {
                this.detailItem = entity;
                this.page = 'entityInventory';
            },
            addKnowledge: function(entity) {
                entity.knowledge.push({
                    wordId: null,
                    experience: 0.5,
                });
            },
            addTactic: function(entity) {
                entity.tactics.push({
                    words: [],
                    hpThreshold: 0.5,
                    conditions: [],
                });
            },
            addTacticWord: function(tactic) {
                tactic.words.push({ wordId: null });
            },
            addTacticCondition: function(tactic) {
                tactic.conditions.push({
                    type: null,
                    buffId: null,
                    target: null,
                });
            },
            addInventoryItem: function(entity) {
                entity.item.push({
                    itemId: null,
                    quantity: 1,
                    dropChance: 0.5,
                });
            },
        },
        computed: {
            downloadString: function() {
                return (
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(JSON.stringify(this.data))
                );
            },
        },
    });
})();
