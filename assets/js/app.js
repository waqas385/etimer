let intervalID;
let uniqueCounter = 0;
const EXERCISE_TIME_UNIT = 1000; // seconds
let appData = [
    {
        timer: 60,
        startSound: '',
        endSound: './assets/tones/start-fire.mp3',
        description: 'Warm-up',
        containerId: 'slotWarmup60' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Shoulders stretch',
        containerId: 'slotShoulderStretch15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Running',
        containerId: 'slotRunning15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Back swim squats',
        containerId: 'slotBackSwimSquats15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Running',
        containerId: 'slotRunning215' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Both arms clockwise',
        containerId: 'slotBothArmsClockwise15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Both arms anticlockwise',
        containerId: 'slotBothArmsAntiClockwise15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: './assets/tones/change.m4a',
        description: 'Neck rotation clockwise',
        containerId: 'slotNeckRotationClockwise15' // should be unique
    },
    {
        timer: 15,
        startSound: '',
        endSound: '', //'./media/sounds/change.m4a',
        description: 'Neck rotation anticlockwise',
        containerId: 'slotNeckRotationAntiClockwise15' // should be unique
    },
];

function isTimeLeft(timeSlot) {
    return timeSlot && Object.keys(timeSlot);
}

function doomsDay() {
    const finishSound = new Audio('./assets/tones/finish-celebration.wav');
    // no more slots left play finish sound and reset
    clearInterval(intervalID);
    finishSound.play();
    reset();
}

function earthLife(phase) {
    let phaseData = appData[phase];
    if (!isTimeLeft(phaseData)) {
        doomsDay();
        return;
    }

    const container = document.querySelector('#' + phaseData.containerId);
    window.scroll(0, parseInt(container.getClientRects()[0].y + 160));
    let timer = phaseData.timer; // seconds
    let startSound = phaseData.startSound
    let endSound = phaseData.endSound
    if (startSound) {
        startSound = new Audio(phaseData.startSound);
        startSound.play();
    }
    if (endSound) {
        endSound = new Audio(phaseData.endSound);
    }

    container.classList.add('active');
    const timeContainer = container.querySelector('#timerContainer');
    intervalID = setInterval(() => {
        --timer;
        if (timer === 0) {
            if (endSound) {
                endSound.play();
            }
            clearInterval(intervalID);

            container.classList.remove('active');
            container.classList.add('completed');
            timeContainer.innerHTML = blessings(phaseData.timer);
            earthLife(++phase);
            return;
        }

        timeContainer.innerHTML = blessings(timer);
    }, EXERCISE_TIME_UNIT);
}

function timeBegins() {
    const PHASE = 0;
    earthLife(PHASE);
}

function blessings(timer) {
    return parseInt(timer / 60).toString().padStart(2, '0') + ':' + (timer % 60).toString().padStart(2, '0');
}

function addEarthLife() {
    let earthLifePhaseTime = document.querySelector('#earthLifeTime').value;
    let earthLifePhaseTimeDescription = document.querySelector('#earthLifeTimeDescription').value;

    appData = appData.filter(Boolean);
    ++uniqueCounter;
    appData.push({
        timer: parseInt(earthLifePhaseTime),
        startSound: '',
        endSound: '',
        description: earthLifePhaseTimeDescription,
        containerId: 'slot' + uniqueCounter + earthLifePhaseTime
    });
    init();
}

function reset() {
    const timerContainer = document.querySelector('#timer');
    timerContainer.innerHTML = '';
    init();
}

function deleteTimeSlot(timeSlotIndex) {
    const timeSlotContainer = document.querySelector('#' + appData[timeSlotIndex].containerId);
    delete (appData[timeSlotIndex]);
    timeSlotContainer.remove();
}

function openSettings(timeSlotIndex) {
    // TODO: Show dialog and user can upload music
    // const timeSlotData = appData[timeSlotIndex];

}

function init() {
    const timerContainer = document.querySelector('#timer');
    const fragment = document.createDocumentFragment();
    timerContainer.innerHTML = '';
    appData.forEach((timeSlot, index) => {
        let timeSlotTemplate = document.querySelector('#timeSlotTemplate').innerHTML.toString();
        timeSlotTemplate = timeSlotTemplate.replace(/__timer__/g, blessings(timeSlot.timer));
        timeSlotTemplate = timeSlotTemplate.replace(/__description__/g, timeSlot.description);
        timeSlotTemplate = timeSlotTemplate.replace(/__index__/g, index);
        timeSlotTemplate = timeSlotTemplate.replace(/__id__/g, timeSlot.containerId);
        const timeSlotContainer = document.createElement('div');
        timeSlotContainer.innerHTML = timeSlotTemplate;
        fragment.append(timeSlotContainer.children[0]);

    });
    timerContainer.append(fragment);
}

init();