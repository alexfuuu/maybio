$(document).ready(function () {

    var Menu = (function () {
        var burger = document.querySelector('.burger');
        var menu = document.querySelector('.menu');
        var menuList = document.querySelector('.menu__list');
        var brand = document.querySelector('.menu__brand');
        var menuItems = document.querySelectorAll('.menu__item');
        var body = document.querySelector('body');

        var active = false;

        var toggleMenu = function () {
            if (!active) {
                menu.classList.add('menu--active');
                menuList.classList.add('menu__list--active');
                brand.classList.add('menu__brand--active');
                body.classList.add('menu-open');
                burger.classList.add('burger--close');
                for (var i = 0, ii = menuItems.length; i < ii; i++) {
                    menuItems[i].classList.add('menu__item--active');
                }
                cancelAnimationFrame(id);
                requestAnimationFrame(animatehead);
                active = true;
            } else {
                menu.classList.remove('menu--active');
                menuList.classList.remove('menu__list--active');
                brand.classList.remove('menu__brand--active');
                body.classList.remove('menu-open');
                burger.classList.remove('burger--close');
                for (var i = 0, ii = menuItems.length; i < ii; i++) {
                    menuItems[i].classList.remove('menu__item--active');
                }
                requestAnimationFrame(animate);
                cancelAnimationFrame(headid);
                active = false;
            }
        };

        var bindActions = function () {
            burger.addEventListener('click', toggleMenu, false);
            menuList.addEventListener('click', toggleMenu, false);
        };

        var init = function () {
            bindActions();
        };

        return {
            init: init
        };

    }());

    Menu.init();

    var animationRunning = true;
    /*$(document).scroll(function () {
        
        if ($(document).scrollTop() > window.innerHeight+200) {
            if (animationRunning == true) {
                
                cancelAnimationFrame(id);
                animationRunning = false;
                console.log("zu weit");
            } else{return}
        }
        if ($(document).scrollTop() < window.innerHeight+200) {
            if (animationRunning == false) {
                 requestAnimationFrame( animate );
                animationRunning = true;
                console.log("besser");
            }
        }
    })  */

    $('#first-slider').flexslider({
        animation: "slide",
        slideshow: false,
        directionNav: false,
        controlNav: false
    });

    $('#first-slider-text').flexslider({
        animation: "fade",
        slideshow: false,
        controlsContainer: $(".custom-controls-container"),
        customDirectionNav: $(".custom-navigation a"),
        sync: "#first-slider",
        asNavFor: '#first-slider-text'

    });



    $('#second-slider').flexslider({
        animation: "slide",
        slideshow: false,
        directionNav: false,
        controlNav: false
    });

    $('#second-slider-text').flexslider({
        animation: "fade",
        slideshow: false,
        controlsContainer: $(".custom-controls-container-second"),
        customDirectionNav: $(".custom-navigation-second a"),
        sync: "#second-slider",
        asNavFor: '#second-slider-text'

    });







    /* set random background */
    var colors = new Array(
        [17, 64, 118],
        [110, 110, 110],
        [224, 20, 20],
        [15, 15, 15]

    );
    var colors2 = new Array(
        [125, 185, 232],
        [230, 230, 230],
        [250, 208, 0],
        [87, 87, 87]
    );

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var randomnumber = randomIntFromInterval(1, 1);


    var color1 = colors[randomnumber];
    var color2 = colors2[randomnumber];


    function updateGradient() {

        $('#gradient').css({
            background: "linear-gradient(135deg, rgb(" + color1 + ") 0%, rgb(" + color2 + ") 100%)"
        });

    }
    updateGradient();


    $("#startArrow").click(function () {
        $('html, body').animate({
            scrollTop: $("#introText").offset().top - 100
        }, 1000);
    });

    $("#biography").click(function () {
        $('html, body').animate({
            scrollTop: $("#first-slider").offset().top - 100
        }, 1000);
    });
    $("#contact").click(function () {
        $('html, body').animate({
            scrollTop: $("#getintouch").offset().top - 100
        }, 1000);
    });

    $("#works").click(function () {
        $('html, body').animate({
            scrollTop: $("#second-slider-text").offset().top - 100
        }, 1000);
    });

    $("#imprint").click(function () {
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    });

    $("#imprint").click(function () {
        $('.imprint').addClass('open');
        $("html, body").animate({
            scrollTop: $(".imprint").offset().top - 100
        }, 1000);

    });

    $("#close-button").click(function () {
        $('.imprint').toggleClass('open');
    });

});



