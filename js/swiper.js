 //#slider swiper
 var silder_swiper = new Swiper(".Swiper", {
            navigation: {
                nextEl: "slider .swiper-button-next",
                prevEl: "slider .swiper-button-prev",
            }, pagination: {
                el: "#slider .swiper-pagination",
            },
        });

        //#new swiper
var new_swiper = new Swiper(".Swiper", {
      slidesPerView: 5,
      spaceBetween: 30,
      pagination: {
        el: "#new .swiper-pagination",
        clickable: true,
      },
       navigation: {
                nextEl: "#new .swiper-button-next",
                prevEl: "#new .swiper-button-prev",
            },
        }); 