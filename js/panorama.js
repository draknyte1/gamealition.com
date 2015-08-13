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

    var firstImage = images[0];

    element.style.backgroundImage    = "url(" + firstImage[0] + ")";
    element.style.backgroundRepeat   = "repeat-x";
    element.style.backgroundPosition = "0px 0px";

    element.onmousedown = function(e)
    {
        pano.grabbed = true;
        pano.lastX   = e.clientX;
    };

    element.onmouseup = function(e)
    {
        pano.grabbed = false;
    };

    element.onmouseout = function(e)
    {
        pano.grabbed = false;
    };

    element.onmousemove = function(e)
    {
        if (!pano.grabbed) return;

        var delta = e.clientX - pano.lastX;

        pano.energy  = delta;
        pano.scroll += delta;
        pano.lastX   = e.clientX;
        pano.element.style.backgroundPosition = pano.scroll + "px 0";
    };

    console.log("Created panorama", pano);
    Panorama.panos.push(pano);
};


Panorama.loop = function()
{
    for (var i = 0; i < Panorama.panos.length; i++)
        Panorama.panos[i].draw();

    window.requestAnimationFrame(Panorama.loop);
};