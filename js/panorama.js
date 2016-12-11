/*
 * 360 Panoramas by Roy Curtis
 * Licensed under MIT, 2015
 */

var Panorama = {};

Panorama.panos = [];

Panorama.create = function(id)
{
    var pano = {};

    pano.jquery  = $(id);
    pano.element = pano.jquery[0];
    pano.slides  = Panorama.getSlides(pano.element);
    pano.current = 0;
    pano.grabbed = false;
    pano.energy  = -1;
    pano.scroll  = 0;
    pano.lastX   = 0;

    pano.draw = function()
    {
        if (pano.energy < -1 || pano.energy > 1)
            pano.energy *= 0.9;
        else
            pano.energy  = -1;

        if (pano.grabbed) return;

        pano.scroll += pano.energy;

        if (pano.scroll < pano.current[1] * -1)
            pano.scroll = 0;

        // Do not use jQuery as this is a fast method
        pano.element.style.backgroundPosition = pano.scroll + "px 0";
    };

    pano.update = function()
    {
        var jquery  = pano.jquery,
            current = pano.slides[pano.current];

        jquery.css("background-image",    "url(" + current.src + ")");
        jquery.css("background-repeat",   "repeat-x");
        jquery.css("background-position", "0px 0px");

        jquery.find(".title").text(current.title);
        jquery.find(".subtitle").text(current.subtitle);
    };

    pano.changeBy = function(delta)
    {
        pano.current += delta;

        if      (pano.current < 0)
            pano.current = pano.slides.length - 1;
        else if (pano.current >= pano.slides.length)
            pano.current = 0;

        pano.update();
    };

    pano.onInputDown = function(e)
    {
        pano.lastX = e.touches
            ? e.touches[0].clientX
            : e.clientX;

        pano.grabbed = true;
    };

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

    var jquery  = pano.jquery,
        element = pano.element;

    element.addEventListener("mousedown",   pano.onInputDown);
    element.addEventListener("mouseup",     pano.onInputUpOrOut);
    element.addEventListener("mouseout",    pano.onInputUpOrOut);
    element.addEventListener("mousemove",   pano.onInputMove);
    element.addEventListener("touchstart",  pano.onInputDown);
    element.addEventListener("touchend",    pano.onInputUpOrOut);
    element.addEventListener("touchleave",  pano.onInputUpOrOut);
    element.addEventListener("touchcancel", pano.onInputUpOrOut);
    element.addEventListener("touchmove",   pano.onInputMove);

    jquery.find("button.prev").click( function() { pano.changeBy(-1); } );
    jquery.find("button.next").click( function() { pano.changeBy(1);  } );

    pano.update();

    console.log("Created panorama with " + pano.slides.length + " slides");
    Panorama.panos.push(pano);
};

Panorama.getSlides = function(element)
{
    var children = element.getElementsByTagName("slide"),
        slides   = [];

    if (children.length == 0)
        throw new Error("No slides defined in panorama");

    for (var i = 0; i < children.length; i++)
    {
        var slide = {},
            child = children[i];

        if (!child.attributes['src'])
            throw new Error("No src specified for slide", child);
        else
            slide.src = child.attributes['src'].value;

        if (!child.attributes['width'])
            throw new Error("No width specified for slide", child);
        else
            slide.width = child.attributes['width'].value;

        slide.title    = child.attributes.title
            ? child.attributes.title.value : "";
        slide.subtitle = child.attributes.subtitle
            ? child.attributes.subtitle.value : "";

        slides.push(slide);
    }

    return slides;
};

Panorama.loop = function()
{
    for (var i = 0; i < Panorama.panos.length; i++)
        Panorama.panos[i].draw();

    window.requestAnimationFrame(Panorama.loop);
};