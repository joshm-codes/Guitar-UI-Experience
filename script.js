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

})();