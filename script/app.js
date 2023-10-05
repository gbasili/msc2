let _bpm = 120;
var _bpmCtrl = document.getElementById('bpm');

let _bit = -1;
let _instruments = 4;
let _maxBit = 16;
let _notesHo = [];
let _notesHc = [];
let _notesCl = [];
let _notesKi = [];
let _patterns = [];

let _sampler = null;

let _scheduleEvent = null;
let _started = false;
let _tlPx = 48;
let _tlStart = 50 + (_tlPx / 2);

const instrumentTryPlay = function(row, chk, n, time){
    if (chk.checked) {
        switch(row){
            case 0:
                _sampler.triggerAttack('A' + n, time);
                break;
            case 1:
                _sampler.triggerAttack('B' + n, time);
                break;
            case 2:
                _sampler.triggerAttack('C' + n, time);
                break;
            case 3:
                _sampler.triggerAttack('D' + n, time);
                break;
            case 4:
                _sampler.triggerAttack('E' + n, time);
                break;
            case 5:
                _sampler.triggerAttack('F' + n, time);
                break;
            case 6:
                _sampler.triggerAttack('G' + n, time);
                break;
        }
    }
}

const onTick = function(time){
    if(_bit >= (_maxBit - 1)){
        _bit = -1;
    }
    _bit++;

    for(var i = 0; i < _instruments; i++){
        const chk = document.getElementById('ck' + i + '-' + _bit);
        instrumentTryPlay(i, chk, chk.parentElement.dataset.in, time);
    }
    document.getElementById('tl').style.left = (_bit * _tlPx + _tlStart).toString() + 'px';
}

const btnStartOnClick = function() {
    document.getElementById('btnStart').style.display = 'none';
    //document.getElementById('btnPause').style.display = 'unset';
    document.getElementById('btnStop').style.display = 'unset';
    document.getElementById('tl').style.display = 'unset';
    document.getElementById('tl').style.left = _tlPx + 'px';
    
    _bit = -1;
    _scheduleEvent = Tone.Transport.scheduleRepeat(function(time){
        onTick(time);
    }, "8n");
    
    Tone.Transport.start();
    _started = true;
}

const btnPauseOnClick = function() {
    document.getElementById('btnStart').style.display = 'unset';
    document.getElementById('btnPause').style.display = 'none';
    
    Tone.Transport.pause();
}

const btnStopOnClick = function() {
    document.getElementById('btnStart').style.display = 'unset';
    //document.getElementById('btnPause').style.display = 'none';
    document.getElementById('btnStop').style.display = 'none';
    document.getElementById('tl').style.display = 'none';
    
    Tone.Transport.clear(_scheduleEvent);
    Tone.Transport.stop();
    _started = false;
}

const btnRecordOnClick = function() {
    alert('Not implemented yet');
}

const btnDownloadOnClick = function() {
    const makeRow = function(selector){
        let row = [];
        document.querySelectorAll('.' + selector + ' input[type="checkbox"]').forEach((chk) => {
            row.push((chk.checked ? 1 : 0));
        });
        return row;
    }
    const pattern = { name: 'Custom', bpm: _bpmCtrl.value, ho: makeRow('row-ho'), hc: makeRow('row-hc'), cl: makeRow('row-cl'), ki: makeRow('row-ki')};
    downloadObjectAsJson(pattern, 'pattern');
}

const btnSaveOnClick = function() {
    const makeRow = function(selector){
        let row = [];
        document.querySelectorAll('.' + selector + ' input[type="checkbox"]').forEach((chk) => {
            row.push((chk.checked ? 1 : 0));
        });
        return row;
    }
    const pattern = { id: 0, name: 'Custom', bpm: _bpmCtrl.value, ho: makeRow('row-ho'), hc: makeRow('row-hc'), cl: makeRow('row-cl'), ki: makeRow('row-ki')};
    for(var i = 0; i < _patterns.length; i++){
        pattern.id = Math.max(pattern.id, parseInt(_patterns[i].id));
    }
    pattern.id = pattern.id + 1;
    _patterns.push(pattern);
    window.localStorage.setItem("dmpattern", JSON.stringify(_patterns));
    const cmPattern = document.getElementById('cm-pattern');
    cmPattern.options[cmPattern.options.length] = new Option(pattern.name, pattern.id);
}

const cmNoteOnInput = function(e){
    e.target.parentElement.dataset.in = e.target.value;
}

// Update the current slider value (each time you drag the slider handle)
_bpmCtrl.oninput = function() {
    document.getElementById('bpm-lb').innerText = this.value + ' bpm';
  
    Tone.Transport.bpm.rampTo(this.value * 2, 0.1);
}

const init = function(){
    initAudio();
    initButton();
    initNotes();
    initPattern();
    initRows();
    initSampler();
    initTone();
}

const initAudio = function(){
    //todo
}

const initButton = function(){
    document.getElementById('btnStart').addEventListener('click', btnStartOnClick);
    document.getElementById('btnPause').addEventListener('click', btnPauseOnClick);
    document.getElementById('btnStop').addEventListener('click', btnStopOnClick);
    document.getElementById('btnRecord').addEventListener('click', btnRecordOnClick);
    document.getElementById('btnDownload').addEventListener('click', btnDownloadOnClick);
    document.getElementById('btnSave').addEventListener('click', btnSaveOnClick);
}

const initNotes = function(){
    _notesHo = [ { n:'A1', u: 'ones/hihat-open.wav'} ];
    _notesHc = [ { n:'B1', u: 'ones/hihat-closed.wav'} ];
    _notesCl = [ { n:'C1', u: 'ones/clap-1.wav'}, { n:'C2', u: 'ones/clap-2.mp3'} ];
    _notesKi = [ { n:'D1', u: 'ones/ones/kick-clean'} ];
    const initNoteCombo = function(select, notes){
        for(var i = 0; i < notes.length; i++){
            select.options[select.options.length] = new Option('N ' + (i + 1), i + 1);
        }
        select.addEventListener('input', cmNoteOnInput )
    }
    initNoteCombo(document.getElementById('cm-ho'), _notesHo);
    initNoteCombo(document.getElementById('cm-hc'), _notesHc);
    initNoteCombo(document.getElementById('cm-cl'), _notesCl);
    initNoteCombo(document.getElementById('cm-ki'), _notesKi);
}

const initPattern = function(){
    _patterns = window.localStorage.getItem("dmpattern");
    if (! _patterns){
        _patterns = [
            { id: 1, name: 'House', bpm: 120, ho: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], hc: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ], cl: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ], ki: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 ]},
            { id: 2, name: 'Rock',  bpm:  80, ho: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ], hc: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ], cl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], ki: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ]}
        ];
        window.localStorage.setItem("dmpattern", JSON.stringify(_patterns));
    }
    _patterns = JSON.parse(window.localStorage.getItem("dmpattern"));
    
    const cmPattern = document.getElementById('cm-pattern');
    _patterns.forEach((pattern) => {
        cmPattern.options[cmPattern.options.length] = new Option(pattern.name, pattern.id);
    });

    cmPattern.addEventListener('input', function (event) {
        if (event.target.value){
            for (var i = 0; i < _patterns.length; i++) {
                if (_patterns[i].id == event.target.value){
                    patternFill(_patterns[i]);
                    break;
                }
            }
        }
    }, false);

}

/*
Check-unchek all rows
*/
const initRows = function(){
    document.querySelectorAll('.row i.dm-uncheck').forEach((chk) => {
        chk.addEventListener('click', function(){
            this.parentElement.querySelectorAll('input[type="checkbox"]').forEach((chk2) => {
                chk2.checked = false;
            });
        });
    });
    
    document.querySelectorAll('.row i.dm-check').forEach((chk) => {
        chk.addEventListener('click', function(){
            this.parentElement.querySelectorAll('input[type="checkbox"]').forEach((chk2) => {
                chk2.checked = true;
            });
        });
    });
}

const initSampler = function(){
    var urls = {};/*
    {
        'A4': 'ones/hihat-closed.wav',
        'B4': 'ones/hihat-open.wav',
        'C4': 'ones/clap-basic.wav',
        'D4': 'ones/kick-clean.wav'
      }*/

    const makeUrl = function(notes){
        for(var i = 0; i < notes.length; i++){
            urls[notes[i].n] = notes[i].u;
        }
    }
    makeUrl(_notesHo);
    makeUrl(_notesHc);
    makeUrl(_notesCl);
    makeUrl(_notesKi);
    
    _sampler = new Tone.Sampler({
        urls: urls,
        release: 0.5,
        baseUrl: '/assets/sounds/',
     }).toDestination();
}

const initTone = function(){
    Tone.Transport.bpm.value = _bpm * 2;
}

init();

const patternFill = function(pattern){
    const fillRow = function(selector, seq){
        document.querySelectorAll('.' + selector + ' input[type="checkbox"]').forEach((chk, idx) => {
            chk.checked = (seq[idx] == 1 ? true : false);
        });
    }
    _bpmCtrl.value = pattern.bpm;
    fillRow('row-ho', pattern.ho);
    fillRow('row-hc', pattern.hc);
    fillRow('row-cl', pattern.cl);
    fillRow('row-ki', pattern.ki);
}

// UTILS
function downloadObjectAsJson(obj, fileName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", fileName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}