document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    //Lenis smooth scroll
    // const lenis = new Lenis({
    //     duration: 1.2
    // });
    // function raf(time) {
    //     lenis.raf(time)
    //     requestAnimationFrame(raf)
    // };

    // requestAnimationFrame(raf);


    // //Lenis to Scrolltrigger
    // lenis.on('scroll', ScrollTrigger.update)

    // gsap.ticker.add((time) => {
    //     lenis.raf(time * 2)
    // });


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
                    trigger: chars[0].closet(".marquee-container"),
                    start: 50% bottom,
                    end: "top top",
                    scrub: true,
                },
        });

    };

    //Font weight

    const splitText = new SplitType(".leftcard h2", {types: "chars"});

    const cardContainers = document.querySelectorAll(".leftcard");

    cardContainers.forEach((container, index) => {
        let start = "0%";
        let end = "-15%";

        if (index % 2 === 0) {
            start = "0%";
            end = "10%";
        }

        const card = container.querySelector(".leftcard");
        const words = card.querySelector(".leftcard h2");

        gsap.fromTo(card, {
            x: start, 
        }, {
            x: end,
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "150% top",
                scrub: true,
            },

        });
        words.forEach((word) => {
            const chars = Array.from(word.quesrySelectorAll(".char"));
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