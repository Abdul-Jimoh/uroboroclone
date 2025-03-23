import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis();

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on('scroll', ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);



  //marquee animation 

  const marquee = () => {
    const marquee = document.querySelector('.hero_marquee');
    const marqueeContent = document.querySelector('.marquee_content');

    if (!marquee || !marqueeContent) {
      return;
    }

    let children = Array.from(marquee.children);
    for (let i = 1; i < children.length; i++) {
      marquee.removeChild(children[i]);
    }

    let marqueeContentCloneOne = marqueeContent.cloneNode(true);
    let marqueeContentCloneTwo = marqueeContent.cloneNode(true);

    marquee.append(marqueeContentCloneOne, marqueeContentCloneTwo);

    let width = marqueeContent.getBoundingClientRect().width;
    let gap = getComputedStyle(marquee).getPropertyValue('column-gap');
    let gapValue = parseFloat(gap);

    let distanceToTranslate = -1 * (width + gapValue);

    gsap.fromTo(marquee.children, {
      x: 0
    }, {
      x: distanceToTranslate,
      repeat: -1,
      ease: 'none',
      duration: 10
    })
  }

  marquee();

  const tagline = () => {
    const tagline = document.querySelectorAll('.tagline_wrapper h1');
    const taglineSection = document.querySelector('.section_tagline');

    const taglineTl = gsap.timeline();

    taglineTl.from(tagline, {
      yPercent: 100,
      opacity: 0,
      ease: 'power2.inOut',
      stagger: 0.1,
      duration: 0.9
    })

    ScrollTrigger.create({
      trigger: taglineSection,
      start: 'top 30%',
      // markers: true,
      animation: taglineTl,
    })

  }

  tagline();

  const cursor = () => {
    const cursorBall = document.querySelector('.cursor-ball');
    const cursorText = document.querySelector('.cursor-text');
    let isHovering = false;
    let currentHoverElement = null;

    if (!cursorBall || !cursorText) {
      return;
    }

    // set initial position of cursor ball
    gsap.set(cursorBall, {
      x: -100,
      y: -100,
      scale: 0.1
    });

    // follow cursor
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursorBall, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // handle hover interaction
    const hoverElements = document.querySelectorAll('[data-ball-hover]');

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        isHovering = true;
        currentHoverElement = element;

        // get custom attributes
        const text = element.getAttribute('data-ball-text') || '';
        const color = element.getAttribute('data-ball-color') || '#7f46ff';

        // update text 
        cursorText.textContent = text;

        //animate the ball
        gsap.to(cursorBall, {
          scale: 1,
          backgroundColor: color,
          duration: 0.4,
          ease: "back"
        });

        //show the text 
        gsap.to(cursorText, {
          opacity: 1,
          duration: 0.2,
        });
      });

      //mouseleave
      element.addEventListener('mouseleave', () => {
        isHovering = false;
        currentHoverElement = null;

        //animate back to initial state 
        gsap.to(cursorBall, {
          scale: 0.1,
          backgroundColor: '#7f46ff',
          duration: 0.4,
          ease: 'power2.out'
        });

        gsap.to(cursorText, {
          opacity: 0,
          duration: 0.2
        });
      });

      //handle document leaving window
      document.addEventListener('mouseleave', () => {
        gsap.to(cursorBall, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      //handle document re-entering window
      document.addEventListener('mouseenter', () => {
        if (!isHovering) {
          gsap.to(cursorBall, {
            scale: 0.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        };
      });
    });
  };

  cursor();

  const featureAnimation = () => {
    const featuresSection = document.querySelector('.section_features');
    const featuresContentWrapper = document.querySelector('.features_content-wrap.last');
    const featuresIcon = document.querySelector('.features_icon');

    if (!featuresSection || !featuresContentWrapper || !featuresIcon) {
      return;
    }

    ScrollTrigger.create({
      trigger: featuresSection,
      start: 'top 30%',
      endTrigger: featuresContentWrapper,
      end: 'center center',
      pin: featuresIcon,
      scrub: true,
      pinSpacing: false,
      // markers: true
    })
  }

  featureAnimation();

  const footerAnimation = () => {
    const footerSection = document.querySelector('.section_footer');

    if (!footerSection) {
      return;
    }

    gsap.to(footerSection, {
      backgroundColor: '#fff',
      duration: 0.7,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: footerSection,
        start: 'top 40%',
        toggleActions: 'play none reverse reset'
      }
    })
  }

  footerAnimation();

  function debounce(func, wait) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  window.addEventListener('resize', debounce(marquee, 100));
})