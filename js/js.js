class Slider {
    // 创建元素
    static createEle ( tagName, className ) {
        const el = document.createElement(tagName);
        el.className = className;
        return el;
    }
    static on ( obj, type, callback) {
        const arr = type.split(' ');
        arr.forEach( item => addEventListener.call(obj, item, callback) );
    }
    static getClass (className) {
        return document.querySelector('.' + className);
    }
    constructor(node, option = '') {
        if(typeof node == 'undefined') {
            throw new Error(' node is not Element ');
        }

        // 默认配置
        const defaultOption = {
            min: 0,
            max: 100,
            isClick: false,
            callback: () => {}
        }
        this.el = { node };
        this.option = Object.assign( {}, defaultOption, option );
        this.setDefaultSlider();
        this.addEvent();
    }


    // 初始化滑杆
    setDefaultSlider () {
        const { min, max, isClick } = this.option;
        const { node } = this.el;
        const { left, width } = node.getBoundingClientRect();
        const ratio = (max - min) / width;
        this.state = { min, max, isClick, ratio, left, width  };
        let html = `
        <p class="slider-range-tip">
            <span class="min">${min}</span>
            -
            <span class="max">${max}</span>
        </p>
        <div class="slider-range">
            <div class="slider-bar"></div>
            <a class="slider-handle slider-handle-min"></a>
            <a class="slider-handle slider-handle-max"></a>
        </div>
        `;
        node.innerHTML = html;
    }
    addEvent () {
        const getEvent = e => e.touches ? e.touches[0] : e;
        const ondown = 'touchstart mousedown';
        const onmove = 'touchmove mousemove';
        const onend = 'touchstart mouseup';
        const onenter = 'touchstart mouseenter';
        const onleave = 'touchend mouseleave';

        // 鼠标按下
        Slider.on( Slider.getClass("slider-range"), ondown, e => {
            const event = getEvent(e);
            const clientX = event.clientX;
            this.state.isClick = true;
            this.handleSlider(clientX); 
        })

        // 鼠标移开
        Slider.on(window, onend, e => {
            const { isClick } = this.state;
            if(isClick) {
                this.state.isClick = false;
            }
        })

        // 鼠标移动
        Slider.on(window, onmove, e => {
            const { isClick } = this.state;
            if( isClick ) {
                const event = getEvent(e);
                const clientX = event.clientX;
                this.handleSlider(clientX); 
            }
        })

    }
    
    handleSlider (clientX) {
        const x = clientX;
        const { left, ratio } = this.state;
        const moveRange = clientX - left;
        const value = Math.round( moveRange * ratio );
        this.handleDom(clientX, moveRange, value);
    }

    handleDom (clientX, moveRange, value) {
        const { min, max, width } = this.state;
        const minDom = Slider.getClass("slider-handle-min");
        const maxDom = Slider.getClass("slider-handle-max");
        const minTip = Slider.getClass("min"); 
        const maxTip = Slider.getClass("max"); 
        const bar = Slider.getClass("slider-bar");
        let barWidth = 0, barLeft = 0;
        if( value < min || value > max) {
            return;
        }
        if(value <= (max - min)/ 2) {
            const { left } = Slider.getClass("slider-handle-max").getBoundingClientRect();
            barWidth = left - clientX;
            barLeft = moveRange;
            minTip.textContent = value;
            minDom.style.left = moveRange + 'px';
        } else {
            const { left } = Slider.getClass("slider-handle-min").getBoundingClientRect();
            barWidth = clientX - left;
            barLeft = moveRange - barWidth;
            maxTip.textContent = value;
            maxDom.style.left = moveRange + 'px';
        }
        bar.style.width = barWidth + 'px';
        bar.style.left = barLeft + 'px';
    }
}