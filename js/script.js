"use strict";

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
    showTabContent(); // End Tabs


    //      TIMER

    let deadLine = '2021-07-22';

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

    setClock('.timer', deadLine); // End Timer
    
    //      MODAL

    const btnModalShow = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    btnModalShow.forEach((e) => {
        e.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
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
        //document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal () {
        modal.classList.remove('show');
        modal.classList.add('hide');
       //document.body.style.overflow = '';
    }

    const modalTimerId = setTimeout(openModal, 50000);
    
    function showModalByScroll () {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll); // End Modal

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
            this.transfer = 74;
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
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getData = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getData('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuItems(img, altimg, title, descr, price, '.menu .container').createItem();
        });
    }); // End Menu


    // FORM

    const form = document.querySelectorAll('form'),
          data = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Мы скоро с вами свяжемся.',
              failure: 'Что-то пошло не так...'
          };
    
    form.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusRequest = document.createElement('img');
            statusRequest.src = data.loading;
            statusRequest.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusRequest);

            const formData = new FormData(form),
                  json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then((info) => {
                console.log(info);
                showThanksModal(data.success);
            })
            .catch(() => {
                showThanksModal(data.failure);
            })
            .finally(() => {
                form.reset();
                statusRequest.remove();
            });
        });
    } 
    
    function showThanksModal (form) {
        const modalDialog = document.querySelector('.modal__dialog');

        modalDialog.classList.add('hide');
        
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${form}</div>
            </div>
        `;
        modal.append(thanksModal);
        openModal();

        setInterval(() => {
            thanksModal.remove();
            modalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }  // End Form

    // Slider

    const sliders = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          wrapper = document.querySelector('.offer__slider-wrapper'),
          slidersLine = document.querySelector('.offer__slider-line'),
          width = window.getComputedStyle(wrapper).width;

    let sliderIndex = 1,
        offset = 0;

    if (sliders.length < 10) {
        total.textContent = `0${sliders.length}`;
    } else {
        total.textContent = sliders.length;
    }

    current.textContent = `0${sliderIndex}`;

    slidersLine.style.display = 'flex';
    slidersLine.style.width = 100 * sliders.length + '%';
    slidersLine.style.transition = 'all .5s';
    wrapper.style.overflow = 'hidden';

    sliders.forEach(item => {
        item.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];

    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < sliders.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        indicators.append(dot);

        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }
    
    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (sliders.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidersLine.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == sliders.length) {
            sliderIndex = 1;
        } else {
            sliderIndex++;
        }

        if (sliderIndex < 10) {
            current.textContent = `0${sliderIndex}`;
        } else {
            current.textContent = sliderIndex;
        }

        changeCurrent();
        activeDot();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (sliders.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2); 
        }
        
        slidersLine.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == 1) {
            sliderIndex = sliders.length;
        } else {
            sliderIndex--;
        }

        changeCurrent();
        activeDot();
    }); 

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            sliderIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);
            slidersLine.style.transform = `translateX(-${offset}px)`;
            changeCurrent();
            activeDot();
        });
    });

    function activeDot () {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[sliderIndex - 1].style.opacity = 1;
    } 
    
    function changeCurrent () {
        if (sliderIndex < 10) {
            current.textContent = `0${sliderIndex}`;
        } else {
            current.textContent = sliderIndex;
        }
    } // End Slider
});