let currentSlide = 0;

function changeSlide(direction) {
    const gallery = document.querySelector('.gallery');
    const totalSlides = gallery.children.length;
    const slidesPerPage = 4; // Number of slides to display per page
    const slideWidth = 100 / slidesPerPage;

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalSlides - slidesPerPage; // Display 4 images at a time
    } else if (currentSlide >= totalSlides - slidesPerPage) {
        currentSlide = 0;
    }

    const transformValue = `translateX(-${currentSlide * slideWidth}%)`;
    gallery.style.transform = transformValue;
}