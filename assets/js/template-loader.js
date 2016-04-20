function loadTemplate(template, curPage) {
    var divTemplate = document.getElementById("template");
    var curNavPage = ' class="cur-nav-page"';
    var data = {
        "content": divTemplate.innerHTML,
        "mobile": /Mobi/.test(navigator.userAgent) ? "mobile" : "no-mobile",
        "pageHome":    curPage == "home" ?    curNavPage : "",
        "pageEdu":     curPage == "edu" ?     curNavPage : "",
        "pageResume":  curPage == "resume" ?  curNavPage : "",
        "pageContact": curPage == "contact" ? curNavPage : ""
    };

    $.get(template, function (templateContent) {
        document.body.innerHTML = Mustache.to_html(templateContent, data);
    });
}