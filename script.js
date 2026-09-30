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