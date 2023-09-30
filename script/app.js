console.log('work');



let _started = false;
let _bit = -1;
let _maxBit = 16;
let _instruments = 3;
let _scheduleEvent = null
let _sampler = new Tone.Sampler({
    urls: {
      'C4': 'bass_sample.mp3',
      'D4': 'clap_sample.mp3',
      'E4': 'hh_sample.mp3'
    },
    release: 0.5,
    baseUrl: '/assets/sounds/',
  }).toDestination();

const instrumentTryPlay = function(row, bit, time){
    if (document.getElementById('ck' + row + '-' + bit).checked) {
        switch(row){
            case 0:
                _sampler.triggerAttack('C4', time);
                break;
            case 1:
                _sampler.triggerAttack('D4', time);
                break;
            case 2:
                _sampler.triggerAttack('E4', time);
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
}

const btnStartOnClick = function() {
    document.getElementById('btnStart').style.display = 'none';
    document.getElementById('btnStop').style.display = 'unset';

    _scheduleEvent = Tone.Transport.scheduleRepeat(function(time){
        onTick(time);
    }, "8n");
    
    Tone.Transport.start();
    _started = true;
}

const btnStopOnClick = function() {
    document.getElementById('btnStart').style.display = 'unset';
    document.getElementById('btnStop').style.display = 'none';
    Tone.Transport.clear(_scheduleEvent);
    Tone.Transport.stop();
    _started = false;
}

const init = function(){
    initButton();
}

const initButton = function(){
    document.getElementById('btnStart').addEventListener('click', btnStartOnClick);
    document.getElementById('btnStop').addEventListener('click', btnStopOnClick );
    //document.getElementById('C4').addEventListener('click', c4OnClick );
    //document.getElementById('D4').addEventListener('click', d4OnClick );
    //document.getElementById('E4').addEventListener('click', e4OnClick );
}

init();


/*
let _sampler;
let _loop;
let _c4Open = false;

const preload = function(){
    _sampler = new Tone.Sampler({
        urls: {
          'C4': 'bass_sample.mp3',
          'D4': 'clap_sample.mp3',
          'E4': 'hh_sample.mp3'
        },
        release: 0.5,
        baseUrl: '/assets/sounds/',
      }).toDestination();

    Tone.Transport.bpm.value = 140; // 96 BPM instead of 120

    _loop = new Tone.Loop((time) => {
        // triggered every eighth note.
        _c4Open = ! _c4Open;
        if (_c4Open){
            //_sampler.triggerAttackRelease('C4', '8n');
        } else {
            //_sampler.triggerAttackRelease('D4', '8n');
            //_sampler.triggerAttackRelease('E4', '8n');
        }

        console.log(time);
    }, "8n").start(0);
    Tone.Transport.start();
}

preload();

const playNote = function(note){
    _sampler.triggerAttackRelease(note, "8n")
}

const c4OnClick = function(){
    playNote('C4');
}

const d4OnClick = function(){
    playNote('D4');
}

const e4OnClick = function(){
    playNote('E4');
    Tone.Transport.stop();
}

document.getElementById('C4').addEventListener('click', c4OnClick );
document.getElementById('D4').addEventListener('click', d4OnClick );
document.getElementById('E4').addEventListener('click', e4OnClick );
*/