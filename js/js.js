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
            isMinHandle: false,
            isMaxHandle: false,
            callback: () => {}
        }
        this.el = { node };
        this.option = Object.assign( {}, defaultOption, option );
        this.setDefaultSlider();
        this.addEvent();
    }


    /* 
    * 初始化滑杆
    * state 包括 最小值，最大值，滑杆盒子位置、宽度，比率，是否点击,是否左手柄操作，是否右手柄操作 
    * newValue 用于存储事件操作后最大值与最小值
    */
    setDefaultSlider () {
        const { min, max, isClick, isMinHandle, isMaxHandle } = this.option;
        const { node } = this.el;
        const { left, width } = node.getBoundingClientRect();
        const ratio = (max - min) / width; 
        this.newValue = { min, max };
        this.state = { min, max, left, width, ratio, isClick, isMinHandle, isMaxHandle };
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
            this.state.isClick ? this.state.isClick = false: "";
            this.state.isMinHandle ? this.state.isMinHandle = false: "";
            this.state.isMaxHandle ? this.state.isMaxHandle = false: "";
            Slider.getClass("slider-handle-min").classList.remove("active");
            Slider.getClass("slider-handle-max").classList.remove("active");
        })

        // 鼠标移动
        Slider.on(window, onmove, e => {
            if( this.state.isClick ) {
                const event = getEvent(e);
                const clientX = event.clientX;
                this.handleSlider(clientX);
            }
        })

    }
    
    // 判断当前鼠标位置与左右手柄距离
    handleSlider (clientX) {
        const minLeft = Slider.getClass("slider-handle-min").offsetLeft;
        const maxLeft = Slider.getClass("slider-handle-max").offsetLeft;
        const { min, max, left, width, ratio } = this.state;
        const moveRange = clientX - left;
        const value = Math.round( moveRange * ratio + min );
        this.state.moveRange = moveRange;
        this.state.minLeft = minLeft;
        this.state.maxLeft = maxLeft;
        if(value > max || value < min ) {
            return;
        } 
        // 这里存在的问题，如果当前符合这个条件，但是鼠标再次点击，在这里就卡住了
        if(this.newValue.min + 1 >= this.newValue.max) {   
            return;
        };
        if( moveRange >= maxLeft || ( moveRange > minLeft && maxLeft - moveRange < moveRange - minLeft ) ) {
            this.state.isMaxHandle = true;
            this.state.isMinHandle = false;
            this.state.maxLeft = moveRange;
            this.newValue.max = value; 
        } else {
            this.state.isMinHandle = true;
            this.state.isMaxHandle = false;
            this.state.minLeft = moveRange;
            this.newValue.min = value; 
        }
        this.handleDom(value);
    }

    handleDom (value) {
        const { min, max, width, moveRange, minLeft, maxLeft } = this.state;
        const maxHandle = Slider.getClass("slider-handle-max");
        const minHandle = Slider.getClass("slider-handle-min");
        const minTip = Slider.getClass("min");  
        const maxTip = Slider.getClass("max");  
        const bar = Slider.getClass("slider-bar");
        const barWidth = maxLeft - minLeft;
        let curHandle, curTip;
        if(this.state.isMaxHandle) {
            curHandle = maxHandle;
            minHandle.classList.remove("active");
            curTip = maxTip;
        } else {
            curHandle = minHandle;
            maxHandle.classList.remove("active");
            curTip = minTip;
        }

        //数值赋值 
        curTip.textContent = value;

        //手柄移位
        curHandle.classList.add("active");
        curHandle.style.left = moveRange + 'px';

        //设置滑杆样式
        bar.style.width = barWidth + 'px';
        bar.style.left = minLeft + 'px';

        this.option.callback(this.newValue.min, this.newValue.max);
    }
}

