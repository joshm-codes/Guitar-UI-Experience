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