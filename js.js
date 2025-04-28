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

    //Font weight

    const animateChars = (chars, reverse = false) => {
        const staggerOptions = {
            each: 0.35,
            from: reverse ? "start" : "end",
            ease: "linear",
        };

        gsap.fromTo(chars, {
            fontWeight: 100,}, {
            fontWeight: 800,
                duration: 1,
                ease: "none",
                stagger: staggerOptions,
                scrollTrigger: {
                    trigger: chars[0].closet(".leftcontainer"),
                    start: 50% bottom,
                    end: "top top",
                    scrub: true,
                },
        });

    };

    const splitText = new SplitType(".leftcard h2", {types: "chars"});

    const cardContainers = document.querySelectorAll(".leftcard");

    cardContainers.forEach((explainercards, index) => {
        let start = "0%";
        let end = "-15%";

        if (index % 2 === 0) {
            start = "0%";
            end = "10%";
        }

        const card = explainercards.querySelector(".leftcontainer");
        const words = explainercards.querySelector(".leftcard h2");

        gsap.fromTo(card, {
            x: start, 
        }, {
            x: end,
            scrollTrigger: {
                trigger: explainercards,
                start: "top bottom",
                end: "150% top",
                scrub: true,
            },

        });

        words.forEach((word) => {
            const chars = Array.from(word.querySelectorAll(".char"));
            if (chars.length) {
                const reverse = index % 2 !== 0;
                animateChars(chars, reverse);
            }
        });

    });


    //Lenis smooth scroll
    
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

});