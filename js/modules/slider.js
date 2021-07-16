function slider ({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

    const sliders = document.querySelectorAll(slide),
          slider = document.querySelector(container),
          prev = document.querySelector(prevArrow),
          next = document.querySelector(nextArrow),
          total = document.querySelector(totalCounter),
          current = document.querySelector(currentCounter),
          slidesWrapper = document.querySelector(wrapper),
          slidesField = document.querySelector(field),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let sliderIndex = 1,
        offset = 0;

    if (sliders.length < 10) {
        total.textContent = `0${sliders.length}`;
    } else {
        total.textContent = sliders.length;
    }

    current.textContent = `0${sliderIndex}`;

    slidesField.style.display = 'flex';
    slidesField.style.width = 100 * sliders.length + '%';
    slidesField.style.transition = 'all .5s';
    slidesWrapper.style.overflow = 'hidden';

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
        if (offset == parseToNumber(width) * (sliders.length - 1)) {
            offset = 0;
        } else {
            offset += parseToNumber(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

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
            offset = parseToNumber(width) * (sliders.length - 1);
        } else {
            offset -= parseToNumber(width); 
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;

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
            offset = parseToNumber(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;
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
    }
    
    function parseToNumber (string) {
        return string = +string.match(/(\d+\.\d+)|(\d+)/g);
    } 
}

export default slider;

