var Panorama = {};

Panorama.panos = [];

Panorama.create = function(id, images)
{
    var pano = {};

    /** @type {HTMLElement} */
    var element = document.getElementById(id);

    if ( !(element instanceof HTMLElement) )
        throw new Error("Not a valid panorama element ID");

    if (images.length == 0)
        throw new Error("No images specified");

    pano.element = element;
    pano.images  = images;
    pano.current = images[0];
    pano.grabbed = false;
    pano.energy  = -1;
    pano.scroll  = 0;
    pano.lastX   = 0;

    pano.draw = function()
    {
        if (pano.energy < -1 || pano.energy > 1)
            pano.energy *= 0.9;
        else
            pano.energy = -1;

        if (pano.grabbed) return;

        pano.scroll += pano.energy;

        if (pano.scroll < pano.current[1] * -1)
            pano.scroll = 0;

        element.style.backgroundPosition = pano.scroll + "px 0";
    };

    pano.onInputDown = function(e)
    {
        pano.lastX = e.touches
            ? e.touches[0].clientX
            : e.clientX;

        pano.grabbed = true;
    };

    /** @param {MouseEvent|TouchEvent} e */
    pano.onInputUpOrOut = function(e)
    {
        if (!e.touches || e.touches.length == 0)
            pano.grabbed = false;
    };

    pano.onInputMove = function(e)
    {
        if (!pano.grabbed) return;

        var clientX = e.touches
            ? e.touches[0].clientX
            : e.clientX;

        var delta = clientX - pano.lastX;

        pano.energy  = delta;
        pano.scroll += delta;
        pano.lastX   = clientX;
        pano.element.style.backgroundPosition = pano.scroll + "px 0";
    };

    var firstImage = images[0];

    element.style.backgroundImage    = "url(" + firstImage[0] + ")";
    element.style.backgroundRepeat   = "repeat-x";
    element.style.backgroundPosition = "0px 0px";

    element.addEventListener("mousedown",   pano.onInputDown);
    element.addEventListener("mouseup",     pano.onInputUpOrOut);
    element.addEventListener("mouseout",    pano.onInputUpOrOut);
    element.addEventListener("mousemove",   pano.onInputMove);
    element.addEventListener("touchstart",  pano.onInputDown);
    element.addEventListener("touchend",    pano.onInputUpOrOut);
    element.addEventListener("touchleave",  pano.onInputUpOrOut);
    element.addEventListener("touchcancel", pano.onInputUpOrOut);
    element.addEventListener("touchmove",   pano.onInputMove);

    console.log("Created panorama", pano);
    Panorama.panos.push(pano);
};


Panorama.loop = function()
{
    for (var i = 0; i < Panorama.panos.length; i++)
        Panorama.panos[i].draw();

    window.requestAnimationFrame(Panorama.loop);
};