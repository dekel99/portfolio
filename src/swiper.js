import Swiper, { Navigation, Pagination, EffectCoverflow } from 'swiper';
import "swiper/css";
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

Swiper.use([Navigation, Pagination, EffectCoverflow]);


function initSwiper(){
    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 50,
            stretch: 60,
            depth: 300,
            modifier: 1.2,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

export default initSwiper