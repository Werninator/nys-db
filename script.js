(function() {
    'use strict';

    var app = new Vue({
        name: 'NYS DATABASE',
        el: '#app',
        data: function() {
            var data = {
                words: [],
                buffs: [],
            };

            if (localStorage.nysDb) data = JSON.parse(localStorage.nysDb);

            return {
                page: 'words',
                pages: [
                    { key: 'home', name: 'Startseite' },
                    { key: 'words', name: 'Wörter' },
                    { key: 'buffs', name: 'Buffs' },
                ],
                effectTypes: {
                    damage: 'Schaden',
                    heal: 'Heilung',
                    buff: 'Buff',
                },
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
                localStorage.nysDb = JSON.stringify(this.data);
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
                    vm.$refs.file.value = '';
                };

                fr.readAsText(files.item(0));
            },
            swap: function(prop, pos1, pos2) {
                var toSwap = this.data[prop][pos1];
                this.data[prop][pos1] = this.data[prop][pos2];
                this.data[prop][pos2] = toSwap;
                this.data[prop] = JSON.parse(JSON.stringify(this.data[prop]));
            },
            remove: function(prop, el) {
                var index = this.data[prop].indexOf(el);
                if (~index) this.data[prop].splice(index, 1);
            },
            duplicate: function(prop, i) {
                this.data[prop].push(
                    JSON.parse(JSON.stringify(this.data[prop][i]))
                );
                this.swap(prop, this.data[prop].length - 1, i + 1);
            },
            // data methods
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
                word.effects.push({ type: null, buff: null });
            },
            removeEffect: function(word, effect) {
                var index = word.effects.indexOf(effect);
                if (~index) word.effects.splice(index, 1);
            },
            addManipulator: function(word) {
                word.manipulators.push({ type: null, buff: null });
            },
            removeManipulator: function(word, effect) {
                var index = word.manipulators.indexOf(effect);
                if (~index) word.manipulators.splice(index, 1);
            },
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
            removeStackEffect: function(buff, effect) {
                var index = buff.onStack.indexOf(effect);
                if (~index) buff.onStack.splice(index, 1);
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
