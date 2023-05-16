"use strict";

     import tabs from './modules/tabs';
     import timer from './modules/timer';
     import cards from './modules/cards';
     import calc from './modules/calc';
     import form from './modules/form';
     import modal from './modules/modal';
     import slider from './modules/slider';
     import openModal from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timer('.timer', '2030-07-22');
    cards();
    calc();
    form('form', modalTimerId);
    modal('[data-modal]', '.modal', modalTimerId);
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-line'
    });
});
