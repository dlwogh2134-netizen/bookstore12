const sliderSwiper = new Swiper(".sliderSwiper", {
  loop: true,
  pagination: {
    el: ".slider-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".slider-next",
    prevEl: ".slider-prev"
  }
});

const newSwiper = new Swiper(".newSwiper", {
  slidesPerView: 5,
  spaceBetween: 12,
  pagination: {
    el: ".new-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".new-next",
    prevEl: ".new-prev"
  },
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 12
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 12
    },
    1180: {
      slidesPerView: 5,
      spaceBetween: 12
    }
  }
});