let _bpm = 120;
var _bpmCtrl = document.getElementById('bpm');

let _bit = -1;
let _instruments = 4;
let _maxBit = 16;
let _sampler = new Tone.Sampler({
    urls: {
      'A4': 'ones/hihat-closed.wav',
      'B4': 'ones/hihat-open.wav',
      'C4': 'ones/clap-basic.wav',
      'D4': 'ones/kick-clean.wav'
    },
    release: 0.5,
    baseUrl: '/assets/sounds/',
 }).toDestination();
let _scheduleEvent = null;
let _started = false;
let _tlPx = 48;
let _tlStart = 50 + (_tlPx / 2);

const instrumentTryPlay = function(row, bit, time){
    if (document.getElementById('ck' + row + '-' + bit).checked) {
        switch(row){
            case 0:
                _sampler.triggerAttack('A4', time);
                break;
            case 1:
                _sampler.triggerAttack('B4', time);
                break;
            case 2:
                _sampler.triggerAttack('C4', time);
                break;
            case 3:
                _sampler.triggerAttack('D4', time);
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
        instrumentTryPlay(i, _bit, time);
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

const btnSaveOnClick = function() {
    alert('Not implemented yet');
}

// Update the current slider value (each time you drag the slider handle)
_bpmCtrl.oninput = function() {
    document.getElementById('bpm-lb').innerText = this.value + ' bpm';
  
    Tone.Transport.bpm.rampTo(this.value * 2, 0.1);
}

const init = function(){
    initAudio();
    initButton();
    initRows();
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
    document.getElementById('btnSave').addEventListener('click', btnSaveOnClick);
}


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

const initTone = function(){
    Tone.Transport.bpm.value = _bpm * 2;
}

init();