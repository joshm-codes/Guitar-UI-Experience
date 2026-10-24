(function(){

     function scrollSetUp(sectionSelector, navSelector){
        const sections = document.querySelectorAll(sectionSelector);
        const navLinks = document.querySelectorAll(navSelector);

        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                const targetID = link.getAttribute("href");
                const targetSection = document.querySelector(targetID);

                const offset = 50; // matches your scroll spy offset
                const topPos = targetSection.offsetTop - offset;

                window.scrollTo({
                    top: topPos,
                    behavior: "smooth"
                });
            });
        });


        window.addEventListener("scroll", () => {
            let current = "";

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                // Use midpoint instead of height/3 for more stable behavior
                if (pageYOffset >= sectionTop - 150){
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");

                // Exact match instead of includes()
                const linkTarget = link.getAttribute("href").replace("#", "");
                if (linkTarget === current){
                    link.classList.add("active");
                }
            });
        });
            
    }
    scrollSetUp('.scroll-section','.nav li a');

})();

(function(){

    function setUpAccordions(accordionselector,headerSelector,iconSelector){
        const accordions = document.querySelectorAll(accordionselector);

        accordions.forEach(item => {
            const header = item.querySelector(headerSelector);
            const icon = item.querySelector(iconSelector);

            header.addEventListener("click", () => {
                const isActive = item.classList.toggle('active');

                if(icon){
                    icon.textContent = isActive ? "◇" : "◆" ;
                }
                if(isActive){
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: "smooth",
                            block: 'start'
                        });
                    },600);
                }
                accordions.forEach(other =>{
                    if(other !== item){
                        other.classList.remove('active');

                    const otherIcon = other.querySelector(iconSelector);
                     if(otherIcon){
                        otherIcon.textContent = "◆";
                    } 
                }
                });
            });
        });
    }
    setUpAccordions('.accordion-item','.accordion-header','.icon');
})();

(function(){

    function tabsFolder(tabSelector,contentSelector){
        const tabs = document.querySelectorAll(tabSelector);
        const contents = document.querySelectorAll(contentSelector);

      document.addEventListener('click', e => {
        const tab = e.target.closest(tabSelector);
        if(!tab)return;

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');

        const targetId = tab.dataset.target;
        const targetContent = document.getElementById(targetId);

        if(targetContent){
            targetContent.classList.add('active');
        }
      });
    }
      tabsFolder('.tab','.content');
      tabsFolder('.electric-tab','.electric-content');  
})();

(function(){

    function setUpSlider(trackSelector,slideSelector,prevSelector,nextSelector,imageSelector,intervalTime = 4000){
        const sliderTrack = document.querySelector(trackSelector);
        const slides = document.querySelectorAll(slideSelector);
        const prevBtn = document.querySelector(prevSelector);
        const nextBtn = document.querySelector(nextSelector);
        const sliderImages = document.querySelectorAll(imageSelector);

    if(
        !sliderTrack ||
        !prevBtn ||
        !nextBtn ||
        !slides.length
    ) return;

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        sliderTrack.append(firstClone);
        sliderTrack.insertBefore(lastClone, slides[0]);

        const allSlides = sliderTrack.querySelectorAll(slideSelector + ', .clone');

        let index = 1;
        slides[0].classList.add('active');
        let slideWidth = allSlides[1].offsetWidth;

        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;

        let isMoving = false;

        function updateSlider(){
            sliderTrack.style.transition = "transform 0.9s ease-in-out";
            sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;
       
            allSlides.forEach(slide => slide.classList.remove('active'));

            const realSlides = [...allSlides].filter(s => !s.classList.contains('clone'));

            let realIndex = index - 1;

            if (realIndex < 0) realIndex = realSlides.length - 1;
            if (realIndex >= realSlides.length) realIndex = 0;

            realSlides[realIndex].classList.add('active');
        }

        let autoSlideInterval = setInterval(() => {
            if(isMoving)return;
            isMoving = true;

            index++;
            updateSlider();
        }, intervalTime);

        function stopSlider(){
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }

        function restartSlider(){
            if(autoSlideInterval)return;
            autoSlideInterval = setInterval(() => {
                if(isMoving)return;
                isMoving = true;

                index++;
                updateSlider();
            },intervalTime);
        }
        
        function nextSlide(){
            if(isMoving)return;
            isMoving = true;

            index++;
            updateSlider();
        }
        function prevSlide(){
            if(isMoving)return;
            isMoving = true;

            index--;
            updateSlider();
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        

        const pauseEvents = ["mouseenter", "focus"];
        const resumeEvents = ["mouseleave", "blur"];

        [prevBtn, nextBtn,sliderTrack, ...sliderImages].forEach(el => {
            pauseEvents.forEach(ev => el.addEventListener(ev, stopSlider));
            resumeEvents.forEach(ev => el.addEventListener(ev, restartSlider));
        });

        sliderTrack.addEventListener("transitionend", () => {
            if(allSlides[index].classList.contains('clone') && index === allSlides.length - 1){
                sliderTrack.style.transition = "none";
                index = 1;
                sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;
            }
            if(allSlides[index].classList.contains('clone') && index === 0){
                sliderTrack.style.transition = "none";
                index = allSlides.length - 2;
                sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;
            }
            isMoving = false;
        });

        let startX = 0;
        let endX = 0;
        const swipeThreshold = 50;

        sliderTrack.addEventListener("touchstart", (e) => {
            stopSlider();
            startX = e.touches[0].clientX;
        });
        sliderTrack.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;

            handleSwipe();
            restartSlider();
        });
        function handleSwipe(){
            const distance = startX - endX;

            if(distance > swipeThreshold){
                nextSlide();
            }
            if(distance < -swipeThreshold){
                prevSlide();
            }
        }

        window.addEventListener('resize', () => {
            slideWidth = allSlides[1].offsetWidth;
            sliderTrack.style.transition = "none";
            sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;
        });
    }
    setUpSlider('.slider-track','.slide','#prev','#next','.slide img');

})();

(function(){

    function setUpRotator(quoteSelector,containerSelector,intervalTime = 4000){
        const quotes = document.querySelectorAll(quoteSelector);
        const container = document.querySelector(containerSelector);

        let index = 0;
        let rotatorInterval = null;

        if(quotes.length === 0 || !container) return;

        const pinsIndicator = createPinsIndicator('.string-pins .pin');

        function startRotator(){
            if(rotatorInterval)return;
            rotatorInterval = setInterval(() => {
               moveNext();
            },intervalTime);
        }
        function stopRotator(){
            clearInterval(rotatorInterval);
            rotatorInterval = null;
        }
        quotes.forEach(bq => bq.classList.remove('show'));
        quotes[index].classList.add('show');
        pinsIndicator.update(index);
        
        startRotator();

        if(container){
            container.addEventListener("mouseenter", stopRotator);
            container.addEventListener("focus", stopRotator);
            container.addEventListener("mouseleave", startRotator);
            container.addEventListener("blur", startRotator);
        }
        function moveNext(){
            quotes[index].classList.remove('show');
            index = (index + 1) % quotes.length;
            quotes[index].classList.add('show');

            pinsIndicator.update(index);
        }
        function movePrev(){
            quotes[index].classList.remove('show');
            index = (index - 1 + quotes.length) % quotes.length;
            quotes[index].classList.add('show');

            pinsIndicator.update(index);
        }

        let startX = 0;
        let endX= 0;
        const swipeThreshold = 50;

        container.addEventListener("touchstart", (e) => {
            stopRotator();
            startX = e.touches[0].clientX;
        });

        container.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;

            handleSwipe();
            startRotator();
        });

        function handleSwipe(){
            const distance = startX - endX;

            if(distance > swipeThreshold){
                moveNext();
            }
            else if(distance < -swipeThreshold){
                movePrev();
            }
        }
    }
    setUpRotator('.rotator .soundhole','.rotator');

    function createPinsIndicator(pinSelector){
            const pins = document.querySelectorAll(pinSelector);

            function update(index){
                const activePin = index % pins.length;
                pins.forEach((pin, i) => {
                    pin.classList.toggle('active', i === activePin);
            });
        }
        return{update};
        }

})();