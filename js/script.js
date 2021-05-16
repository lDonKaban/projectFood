window.addEventListener('DOMContentLoaded', () => {

    //      TABS

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll('.tabcontent'),
          tabParent = document.querySelector('.tabheader__items');

    function hideTabContent () {
        tabContent.forEach((item) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach((item) => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent (i = 0) {
        tabs[i].classList.add('tabheader__item_active');
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');
    }

    tabParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    hideTabContent();
    showTabContent();


    //      TIMER

    let deadLine = '2021-04-20';

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

    setClock('.timer', deadLine);
    
    //      MODAL

    const btnModalShow = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          btnModalClose = document.querySelector('[data-close');

    btnModalShow.forEach((e) => {
        e.addEventListener('click', openModal);
    });

    btnModalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function openModal () {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal () {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    const modalTimerId = setTimeout(openModal, 4000);
    
    function showModalByScroll () {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // MENU

    class MenuItems {
        constructor (url, alt, title, text, price, parentSelector, ...classes) {
            this.url = url;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH () {
            this.price = this.price * this.transfer;
        }

        createItem () {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.class = 'menu__item';
                element.classList.add(this.class);
            } else {
               this.classes.forEach(className => element.classList.add(className));
            }


            element.innerHTML = `
                <img src="${this.url}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuItems (
        'img/tabs/vegy.jpg', 
        'vegy', 
        'Меню "Фитнес"', 
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 
        9,
        '.menu .container').createItem();

    new MenuItems (
        'img/tabs/elite.jpg', 
        'elite', 
        'Меню “Премиум”', 
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 
        14,
        '.menu .container').createItem();

    new MenuItems (
        'img/tabs/post.jpg', 
        'post', 
        'Меню "Постное"', 
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 
        21,
        '.menu .container').createItem();
});