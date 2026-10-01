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
                    if(other !== item)other.classList.remove('active');
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

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {

                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');

                const targetId = tab.dataset.target;
                const targetContent = document.getElementById(targetId);

                if(targetId){
                    targetContent.classList.add('active');
                }
            });
        });
    }
      tabsFolder('.tab','.content');
      tabsFolder('.electric-tab','.electric-content');  
})();

(function(){

    function setUpSlider(trackSelector,slideSelector,prevSelector,nextSelector){
        const sliderTrack = document.querySelector(trackSelector);
        const slides = document.querySelectorAll(slideSelector);
        const prevBtn = document.querySelector(prevSelector);
        const nextBtn = document.querySelector(nextSelector);

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        sliderTrack.append(firstClone);
        sliderTrack.insertBefore(lastClone, slides[0]);

        const allSlides = sliderTrack.querySelectorAll(slideSelector + ', .clone');

        let index = 1;
        let slideWidth = allSlides[1].offsetWidth;

        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;

        let isMoving = false;

        function updateSlider(){
            sliderTrack.style.transition = "transform 0.9s ease-in-out";
            sliderTrack.style.transform = `translateX(-${index *slideWidth}px)`;
        }
        prevBtn.addEventListener('click', () => {
            if(isMoving) return;
            isMoving = true;

            index--;
            updateSlider();
        });
        nextBtn.addEventListener('click', () => {
            if(isMoving) return;
            isMoving = true;

            index++;
            updateSlider();
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
        window.addEventListener('resize', () => {
            let slideWidth = allSlides[1].offsetWidth;
            sliderTrack.style.transition = "none";
            sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;
        });
    }
    setUpSlider('.slider-track','.slide','#prev','#next');

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
                quotes[index].classList.remove('show');
                index = (index + 1) % quotes.length;
                quotes[index].classList.add('show');

                pinsIndicator.update(index);
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