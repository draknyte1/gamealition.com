
/* Courtesy http://stackoverflow.com/a/11128179/3354920 */
if (window.getSelection)
    $('value').mouseover(function (e)
    {
        var sel   = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(e.target);
        sel.removeAllRanges();
        sel.addRange(range);
    });