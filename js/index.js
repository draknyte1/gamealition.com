/*
 * Gamealition main website logic by Roy Curtis
 * Licensed under MIT, 2015
 */

function autoSelector(evt)
{
    var sel   = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(evt.target);
    sel.removeAllRanges();
    sel.addRange(range);
}

function attachAutoSelector(element)
{
    element.onmouseover = autoSelector;
}

/* Courtesy http://stackoverflow.com/a/11128179/3354920 */
if (window.getSelection)
    document.querySelectorAll('value').forEach(attachAutoSelector);