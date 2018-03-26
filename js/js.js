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


    /* 
    * 初始化滑杆
    * state 包括 最小值，最大值，滑杆盒子位置、宽度，比率，是否点击 
    */
    setDefaultSlider () {
        const { min, max, isClick } = this.option;
        const { node } = this.el;
        const { left, width } = node.getBoundingClientRect();
        const ratio = (max - min) / width; 
        this.state = { min, max, left, width, ratio, isClick};
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
            Slider.getClass("slider-handle").classList.remove("active");
        })

    }
    
    // 判断当前鼠标位置与左右手柄距离
    handleSlider (clientX) {
        const minLeft = Slider.getClass("slider-handle-min").offsetLeft;
        const maxLeft = Slider.getClass("slider-handle-max").offsetLeft;
        const { min, max, left, width, ratio } = this.state;
        const moveRange = clientX - left;
        const value = Math.round( moveRange*ratio + min );
        this.state.moveRange = moveRange;
        this.state.minLeft = minLeft;
        this.state.maxLeft = maxLeft;
        if( moveRange - minLeft >= (maxLeft - minLeft)/2) {
            this.state.maxLeft = moveRange;
            this.handleDom("max", value);
        } else {
            this.state.minLeft = moveRange;
            this.handleDom("min", value);
        }
    }

    handleDom (handles, value) {
        const { min, max, width, moveRange, minLeft, maxLeft } = this.state;
        const handle = Slider.getClass("slider-handle-" + handles);
        const tip = Slider.getClass(handles);  
        const bar = Slider.getClass("slider-bar");
        if(value > max || value < min) {
            return;
        }
        //数值赋值 
        tip.textContent = value;

        //手柄移位
        handle.classList.add("active");
        handle.style.left = moveRange + 'px';

        //设置滑杆样式
        bar.style.width = maxLeft - minLeft + 'px';
        bar.style.left = minLeft + 'px';
    }
}

