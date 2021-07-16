import {openModal, closeModal} from './modal';
import {postData} from '../services/services';

function form (formSelector, modalTimerId) {

    const form = document.querySelectorAll(formSelector),
    data = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    form.forEach(item => {
        bindPostData(item);
    });

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
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${form}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setInterval(() => {
            thanksModal.remove();
            modalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }  
}

export default form;