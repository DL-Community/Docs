// Copyright FengYan

window.$docsify.plugins = [
    function(hook) {
        // 判断当前语言
        const match = location.hash.match(/^#\/([^\/?#]+)/);
        const lang = match ? match[1] : '';

        var root = window.$docsify.basePath;
        // 根据语言设置footer文件的path
        if(lang == 'en'){
            var footerPath = root + "/en/_footer.html";
        }
        else{
            var footerPath = root + "/_footer.html";
        }
        hook.afterEach(function(html, next) {
            fetch(footerPath)
            .then(response => response.text())
            .then(htmlContent => {
                    next(html + htmlContent);
               });
       });


    }
    ].concat(window.$docsify.plugins || [])