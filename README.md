# Slider
一个双向滑杆插件

## 说明
es6实现，不支持低版本浏览器

## Example
``` 
<body>
    <div class="slider-box">
    </div>
    <script src="js/js.js"></script>
    <script>
        var s = new Slider( document.querySelector('.slider-box'), {
            min: 0,
            max: 100,
            callback: function(min,max) {
                // 获取newMin和newMax
                // console.log(min,max);
            }
        });
    </script>
</body>
```
