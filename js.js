document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);


    let leftCardItems = document.querySelectorAll('.cardimg');
    leftCardItems.forEach(function(item, index) {
        item.style.zIndex = leftCardItems.length - index;
    });

    gsap.set(".cardimg", {
        clipPath: function () {
            return "inset(0px 0px 0px 0px)"
        }
    });

    const animation = gsap.to('.cardimg:not(:last-child)', {
        clipPath: function () {
            return "inset(0px 0px 100% 0px)"
        },
        stagger: .5,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: '.explainercards',
        start: 'top top',
        end: 'bottom bottom',
        animation: animation,
        scrub: 1,
    });

    gsap.from(".fade", {duration: 3, opacity: 0, ease: "power2", stagger: 0.4, });

    function init(){

        gsap.to(".fade", {opacity: 0, duration: 2, 
            scrollTrigger: {
                trigger: ".fade",
                start: "top bottom",
                end: "bottom bottom",
                toggleActions: "restart pause resume restart",
                scrub: 1,
            }
        });

        const h1 = gsap.utils.toArray("h1");
        h1.forEach(h1 => {
            gsap.from(h1, {
                opacity: 0,
                duration: 2,
                yPercent: 30,
                scrub: 1.5,
                scrollTrigger: {
                    trigger: h1,
                    start: "top bottom-=10%",
                    end: "top center",
                    toggleActions: "play none none reverse",
                }
            })
        });

        

    } //init


    //Lenis smooth scroll
    
    /* const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0); */

});