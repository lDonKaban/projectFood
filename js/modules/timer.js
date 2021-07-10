function timer (id, deadLine) {

    function getTimeRemaining(endtime) {
        const timer = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(timer / 1000 / 60 / 60 / 24),
              hours = Math.floor((timer / 1000 / 60 / 60) % 24),
              minutes = Math.floor((timer / 1000 / 60) % 60),
              seconds = Math.floor((timer / 1000) % 60);

        return {
              'total': timer,
              days,
              hours,
              minutes,
              seconds
        };
    }

    function setClock (selector, endtime) {
        const time = document.querySelector(selector),
              days = time.querySelector('#days'),
              hours = time.querySelector('#hours'),
              minutes = time.querySelector('#minutes'),
              seconds = time.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        function updateClock () {
            const t = getTimeRemaining(endtime);
            days.innerHTML = setZero(t.days);
            hours.innerHTML = setZero(t.hours);
            minutes.innerHTML = setZero(t.minutes);
            seconds.innerHTML = setZero(t.seconds);
        }
    }

    function setZero (elem) {
        if (elem >= 0 && elem < 10) {
            return '0' + elem;
        }
        return elem;
    }

    setClock(id, deadLine); 
}

export default timer;