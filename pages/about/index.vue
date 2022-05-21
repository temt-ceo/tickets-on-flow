<template>
  <section class="section">
    <!--==========================
      About Us Section
    ============================-->
    <section id="about">
      <b-breadcrumb>
        <b-breadcrumb-item href="/?return=true">
          <b-icon
            icon="rotate-left"
            size="is-large">
          </b-icon>
        </b-breadcrumb-item>
      </b-breadcrumb>

      <div class="container">

        <header class="section-header">
          <h3>About Us</h3>
          <p class="about-title-content">
            {{ $t('terms_of_use1') }}<br><br>
            {{ $t('terms_of_use2') }}<br><br>
            {{ $t('terms_of_use3') }}<br><br>
            {{ $t('terms_of_use4') }}<br><br>
            {{ $t('terms_of_use5') }}<br><br>
            {{ $t('terms_of_use6') }}<br><br>
            {{ $t('terms_of_use7') }}<br><br>
            {{ $t('terms_of_use8') }}<br><br>
            {{ $t('terms_of_use9') }}<br><br>
            {{ $t('terms_of_use10') }}<br><br>
            {{ $t('terms_of_use11') }}<br><br>
            {{ $t('terms_of_use12') }}<br><br>
            {{ $t('terms_of_use13') }}<br><br>
            {{ $t('terms_of_use15') }}<br><br>
            {{ $t('terms_of_use16') }}<br><br>
          </p>
        </header>

        <div class="row about-cols">

          <div class="col-md-4 wow fadeInUp">
            <div class="about-col">
              <div class="img">
                <img src="img/about-mission.jpg" alt="" class="img-fluid">
                <div class="icon"><i class="ion-ios-speedometer-outline"></i></div>
              </div>
              <h2 class="title"><a href="#">Our Mission</a></h2>
              <p class="mission">
                We wanted to make it possible for the war-afflicted people in Ukraine to do business and make money using only their smartphones.<br><br>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section><!-- #about -->

    <!--==========================
      Team Section
    ============================-->
    <section id="team">
      <div class="container">
        <div class="section-header wow fadeInUp">
          <h3>Team</h3>
          <p>The team leans in and works hard every day to create a code that allows the viewer to have a great experience.</p>
        </div>

        <div class="row">

          <div class="col-lg-3 col-md-6 wow fadeInUp">
            <div class="member">
              <img src="/img/team-1.jpeg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Takashi Tahara</h4>
                  <span>Chief Executive Officer</span>
                  <div class="social">
                    <a href="https://mobile.twitter.com/geek_geek_t" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                    <a href="https://facebook.com/takashi.tahara.39" target="_blank"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://www.kaggle.com/takashitahara" target="_blank"><i class="fa-brands fa-kaggle"></i></a>
                    <a href="https://jp.linkedin.com/in/tahara-takashi-em-technology/en" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="member">
              <img src="/img/team-2.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Mio Yoneshima</h4>
                  <span>Product Manager</span>
                  <div class="social">
                    <a href="https://twitter.com/_official_asp" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section><!-- #team -->

    <!--==========================
      Services Section
    ============================-->
    <section id="services">
      <div class="container">

        <header class="section-header wow fadeInUp">
          <h3>Services</h3>
          <p>We are working hard to develop systems that can be said to be indispensable in our daily lives with cutting-edge technology.</p>
        </header>

        <div class="row">

          <div class="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
            <div class="icon"><i class="ion-ios-analytics-outline"></i></div>
            <h4 class="title"><a href="https://www.kaggle.com/code/takashitahara/stock-expected-move-analysis" target="_blank">Stock Expected Move Analysis</a></h4>
            <p class="description">Prediction results are calculated using AI model.</p>
          </div>
          <div class="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
            <div class="icon"><i class="ion-ios-bookmarks-outline"></i></div>
            <h4 class="title"><a href="https://tickets-on-flow.web.app/?m=developer">Tickets</a></h4>
            <p class="description">The bussiness application built on Flow Blockchain.</p>
          </div>

        </div>

      </div>
    </section><!-- #services -->

    <!--==========================
      Footer
    ============================-->
    <footer id="footer">
      <div class="footer-top">
        <div class="container">
          <div class="row">

            <div class="col-lg-3 col-md-6 footer-info">
              <h3>Contact Us</h3>
            </div>

            <div class="col-lg-3 col-md-6 footer-contact">
              <p>
                Gloriole Satomi-one 411 <br>
                10 - 1 Hinode, Ichikawa, Chiba 2720135<br>
                Japan <br>
                <strong>Phone:</strong> +81 47 711 1656<br>
                <strong>Email:</strong> tickets.on.flow@gmail.com<br>
              </p>

              <div class="social-links">
                <a href="https://mobile.twitter.com/_official_asp" class="twitter" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                <a href="https://www.instagram.com/takashi_tahara_tokyo/" class="instagram" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://jp.linkedin.com/in/tahara-takashi-em-technology/en" class="linkedin" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div class="container">
        <div class="copyright">
          &copy; Copyright Tokyo EM Technology & Co.<br> All Rights Reserved
        </div>
      </div>
    </footer><!-- #footer -->

    <a href="#" class="back-to-top"><i class="fa fa-chevron-up"></i></a>
    <!-- Uncomment below i you want to use a preloader -->
    <!-- <div id="preloader"></div> -->

    <!-- JavaScript Libraries -->
    <script src="lib/jquery/jquery.min.js"></script>
    <script src="lib/jquery/jquery-migrate.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/superfish/hoverIntent.js"></script>
    <script src="lib/superfish/superfish.min.js"></script>
    <script src="lib/wow/wow.min.js"></script>
    <script src="lib/waypoints/waypoints.min.js"></script>
    <script src="lib/counterup/counterup.min.js"></script>
    <script src="lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="lib/isotope/isotope.pkgd.min.js"></script>
    <script src="lib/lightbox/js/lightbox.min.js"></script>
    <script src="lib/touchSwipe/jquery.touchSwipe.min.js"></script>
    <!-- Contact Form JavaScript File -->
    <script src="contactform/contactform.js"></script>

    <!-- Template Main Javascript File -->
    <script src="js/main.js"></script>
  </section>
</template>

<script>

export default {
  name: 'AboutPage',
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i|Montserrat:300,400,500,700' },
        { rel: 'stylesheet', href: 'lib/font-awesome/css/font-awesome.min.css' },
        { rel: 'stylesheet', href: 'lib/animate/animate.min.css' },
        { rel: 'stylesheet', href: 'lib/ionicons/css/ionicons.min.css' },
        { rel: 'stylesheet', href: 'lib/owlcarousel/assets/owl.carousel.min.css' },
        { rel: 'stylesheet', href: 'lib/lightbox/css/lightbox.min.css' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
/*
  Theme Name: BizPage
  Theme URL: https://bootstrapmade.com/bizpage-bootstrap-business-template/
  Author: BootstrapMade.com
  License: https://bootstrapmade.com/license/
*/

/*--------------------------------------------------------------
# General
--------------------------------------------------------------*/

body {
  background: #fff;
  color: #666666;
  font-family: "Open Sans", sans-serif;
}

a {
  color: #18d26e;
  transition: 0.5s;
}

a:hover,
a:active,
a:focus {
  color: #18d36e;
  outline: none;
  text-decoration: none;
}

p {
  padding: 0;
  margin: 0 0 30px 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  margin: 0 0 20px 0;
  padding: 0;
}

/* Back to top button */
.breadcrumb {
  z-index: 11;
}

.back-to-top {
  position: fixed;
  display: none;
  background: #18d26e;
  color: #fff;
  width: 44px;
  height: 44px;
  text-align: center;
  line-height: 1;
  font-size: 16px;
  border-radius: 50%;
  right: 15px;
  bottom: 15px;
  transition: background 0.5s;
  z-index: 11;
}

.back-to-top i {
  padding-top: 12px;
  color: #fff;
}

/* Prelaoder */

#preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  overflow: hidden;
  background: #fff;
}

#preloader:before {
  content: "";
  position: fixed;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  border: 6px solid #f2f2f2;
  border-top: 6px solid #18d26e;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  -webkit-animation: animate-preloader 1s linear infinite;
  animation: animate-preloader 1s linear infinite;
}

@-webkit-keyframes animate-preloader {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes animate-preloader {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/*--------------------------------------------------------------
# Header
--------------------------------------------------------------*/

#header {
  padding: 30px 0;
  height: 92px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  transition: all 0.5s;
  z-index: 997;
}

#header.header-scrolled {
  background: rgba(0, 0, 0, 0.9);
  padding: 20px 0;
  height: 72px;
  transition: all 0.5s;
}

#header #logo {
  float: left;
}

#header #logo h1 {
  font-size: 34px;
  margin: 0;
  padding: 0;
  line-height: 1;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
}

#header #logo h1 a,
#header #logo h1 a:hover {
  color: #fff;
  padding-left: 10px;
  border-left: 4px solid #18d26e;
}

#header #logo img {
  padding: 0;
  margin: 0;
}

/*--------------------------------------------------------------
# Intro Section
--------------------------------------------------------------*/

#intro {
  display: table;
  width: 100%;
  height: 100vh;
  background: #000;
}

#intro .carousel-item {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#intro .carousel-item::before {
  content: '';
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

#intro .carousel-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}

#intro .carousel-background img {
  max-width: 100%;
}

#intro .carousel-content {
  text-align: center;
}

#intro h2 {
  color: #fff;
  margin-bottom: 30px;
  font-size: 48px;
  font-weight: 700;
}

#intro p {
  width: 80%;
  margin: 0 auto 30px auto;
  color: #fff;
}

#intro .carousel-fade {
  overflow: hidden;
}

#intro .carousel-fade .carousel-inner .carousel-item {
  transition-property: opacity;
}

#intro .carousel-fade .carousel-inner .carousel-item,
#intro .carousel-fade .carousel-inner .active.carousel-item-left,
#intro .carousel-fade .carousel-inner .active.carousel-item-right {
  opacity: 0;
}

#intro .carousel-fade .carousel-inner .active,
#intro .carousel-fade .carousel-inner .carousel-item-next.carousel-item-left,
#intro .carousel-fade .carousel-inner .carousel-item-prev.carousel-item-right {
  opacity: 1;
  transition: 0.5s;
}

#intro .carousel-fade .carousel-inner .carousel-item-next,
#intro .carousel-fade .carousel-inner .carousel-item-prev,
#intro .carousel-fade .carousel-inner .active.carousel-item-left,
#intro .carousel-fade .carousel-inner .active.carousel-item-right {
  left: 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

#intro .carousel-control-prev,
#intro .carousel-control-next {
  width: 10%;
}

#intro .carousel-control-next-icon,
#intro .carousel-control-prev-icon {
  background: none;
  font-size: 32px;
  line-height: 1;
}

#intro .carousel-indicators li {
  cursor: pointer;
}

#intro .btn-get-started {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 1px;
  display: inline-block;
  padding: 8px 32px;
  border-radius: 50px;
  transition: 0.5s;
  margin: 10px;
  color: #fff;
  background: #18d26e;
}

#intro .btn-get-started:hover {
  background: #fff;
  color: #18d26e;
}

/*--------------------------------------------------------------
# Navigation Menu
--------------------------------------------------------------*/

/* Nav Menu Essentials */

.nav-menu,
.nav-menu * {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-menu ul {
  position: absolute;
  display: none;
  top: 100%;
  left: 0;
  z-index: 99;
}

.nav-menu li {
  position: relative;
  white-space: nowrap;
}

.nav-menu > li {
  float: left;
}

.nav-menu li:hover > ul,
.nav-menu li.sfHover > ul {
  display: block;
}

.nav-menu ul ul {
  top: 0;
  left: 100%;
}

.nav-menu ul li {
  min-width: 180px;
}

/* Nav Menu Arrows */

.sf-arrows .sf-with-ul {
  padding-right: 30px;
}

.sf-arrows .sf-with-ul:after {
  content: "\f107";
  position: absolute;
  right: 15px;
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
}

.sf-arrows ul .sf-with-ul:after {
  content: "\f105";
}

/* Nav Meu Container */

#nav-menu-container {
  float: right;
  margin: 0;
}

/* Nav Meu Styling */

.nav-menu a {
  padding: 0 8px 10px 8px;
  text-decoration: none;
  display: inline-block;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  outline: none;
}

.nav-menu li:hover > a,
.nav-menu > .menu-active > a {
  color: #18d26e;
}

.nav-menu > li {
  margin-left: 10px;
}

.nav-menu ul {
  margin: 4px 0 0 0;
  padding: 10px;
  box-shadow: 0px 0px 30px rgba(127, 137, 161, 0.25);
  background: #fff;
}

.nav-menu ul li {
  transition: 0.3s;
}

.nav-menu ul li a {
  padding: 10px;
  color: #333;
  transition: 0.3s;
  display: block;
  font-size: 13px;
  text-transform: none;
}

.nav-menu ul li:hover > a {
  color: #18d26e;
}

.nav-menu ul ul {
  margin: 0;
}

/* Mobile Nav Toggle */

#mobile-nav-toggle {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  margin: 20px 20px 0 0;
  border: 0;
  background: none;
  font-size: 24px;
  display: none;
  transition: all 0.4s;
  outline: none;
  cursor: pointer;
}

#mobile-nav-toggle i {
  color: #fff;
}

/* Mobile Nav Styling */

#mobile-nav {
  position: fixed;
  top: 0;
  padding-top: 18px;
  bottom: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.8);
  left: -260px;
  width: 260px;
  overflow-y: auto;
  transition: 0.4s;
}

#mobile-nav ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

#mobile-nav ul li {
  position: relative;
}

#mobile-nav ul li a {
  color: #fff;
  font-size: 13px;
  text-transform: uppercase;
  overflow: hidden;
  padding: 10px 22px 10px 15px;
  position: relative;
  text-decoration: none;
  width: 100%;
  display: block;
  outline: none;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
}

#mobile-nav ul li a:hover {
  color: #18d26e;
}

#mobile-nav ul li li {
  padding-left: 30px;
}

#mobile-nav ul li.menu-active a {
  color: #18d26e;
}

#mobile-nav ul .menu-has-children i {
  position: absolute;
  right: 0;
  z-index: 99;
  padding: 15px;
  cursor: pointer;
  color: #fff;
}

#mobile-nav ul .menu-has-children i.fa-chevron-up {
  color: #18d26e;
}

#mobile-nav ul .menu-has-children li a {
  text-transform: none;
}

#mobile-nav ul .menu-item-active {
  color: #18d26e;
}

#mobile-body-overly {
  width: 100%;
  height: 100%;
  z-index: 997;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  display: none;
}

/* Mobile Nav body classes */

body.mobile-nav-active {
  overflow: hidden;
}

body.mobile-nav-active #mobile-nav {
  left: 0;
}

body.mobile-nav-active #mobile-nav-toggle {
  color: #fff;
}

/*--------------------------------------------------------------
# Sections
--------------------------------------------------------------*/

/* Sections Header
--------------------------------*/

.section-header h3 {
  font-size: 32px;
  color: #111;
  text-transform: uppercase;
  text-align: center;
  font-weight: 700;
  position: relative;
  padding-bottom: 15px;
}

.section-header h3::before {
  content: '';
  position: absolute;
  display: block;
  width: 120px;
  height: 1px;
  background: #ddd;
  bottom: 1px;
  left: calc(50% - 60px);
}

.section-header h3::after {
  content: '';
  position: absolute;
  display: block;
  width: 40px;
  height: 3px;
  background: #18d26e;
  bottom: 0;
  left: calc(50% - 20px);
}

.section-header p {
  text-align: center;
  padding-bottom: 30px;
  color: #333;
}

/* Section with background
--------------------------------*/

.section-bg {
  background: #f7f7f7;
}

/* Featured Services Section
--------------------------------*/

#featured-services {
  background: #000;
}

#featured-services .box {
  padding: 30px 20px;
}

#featured-services .box-bg {
  background-image: linear-gradient(0deg, #000000 0%, #242323 50%, #000000 100%);
}

#featured-services i {
  color: #18d26e;
  font-size: 48px;
  display: inline-block;
  line-height: 1;
}

#featured-services h4 {
  font-weight: 400;
  margin: 15px 0;
  font-size: 18px;
}

#featured-services h4 a {
  color: #fff;
}

#featured-services h4 a:hover {
  color: #18d26e;
}

#featured-services p {
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  margin-bottom: 0;
}

/* About Us Section
--------------------------------*/

#about {
  background: url("/img/about-bg.jpg") center top no-repeat fixed;
  background-size: cover;
  padding: 60px 1em 40px 1em;
  position: relative;
}

#about::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.92);
  z-index: 9;
}

#about .container {
  position: relative;
  z-index: 10;
}

#about .about-col {
  background: #fff;
  border-radius: 0 0 4px 4px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

#about .about-col .img {
  position: relative;
}

#about .about-col .img img {
  border-radius: 4px 4px 0 0;
}

#about .about-col .icon {
  width: 64px;
  height: 64px;
  padding-top: 8px;
  text-align: center;
  position: absolute;
  background-color: #18d26e;
  border-radius: 50%;
  text-align: center;
  border: 4px solid #fff;
  left: calc( 50% - 32px);
  bottom: -30px;
  transition: 0.3s;
}

#about .about-col i {
  font-size: 36px;
  line-height: 1;
  color: #fff;
  transition: 0.3s;
}

#about .about-col:hover .icon {
  background-color: #fff;
}

#about .about-col:hover i {
  color: #18d26e;
}

#about .about-col h2 {
  color: #000;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  padding: 0;
  margin: 40px 0 12px 0;
}

#about .about-col h2 a {
  color: #000;
}

#about .about-col h2 a:hover {
  color: #18d26e;
}

#about .about-col p {
  font-size: 14px;
  line-height: 24px;
  color: #333;
  margin-bottom: 0;
  padding: 0 20px 20px 20px;
}

/* Services Section
--------------------------------*/

#services {
  background: #fff;
  background-size: cover;
  padding: 60px 0 40px 0;
}

#services .box {
  margin-bottom: 30px;
}

#services .icon {
  float: left;
}

#services .icon i {
  color: #18d26e;
  font-size: 36px;
  line-height: 1;
  transition: 0.5s;
}

#services .title {
  margin-left: 60px;
  font-weight: 700;
  margin-bottom: 15px;
  font-size: 18px;
}

#services .title a {
  color: #111;
}

#services .box:hover .title a {
  color: #18d26e;
}

#services .description {
  font-size: 14px;
  margin-left: 60px;
  line-height: 24px;
  margin-bottom: 0;
}

/* Portfolio Section
--------------------------------*/

#portfolio {
  padding: 60px 1em;
}

#portfolio #portfolio-flters {
  padding: 0;
  margin: 5px 0 35px 0;
  list-style: none;
  text-align: center;
}

#portfolio #portfolio-flters li {
  cursor: pointer;
  margin: 15px 15px 15px 0;
  display: inline-block;
  padding: 10px 20px;
  font-size: 12px;
  line-height: 20px;
  color: #666666;
  border-radius: 4px;
  text-transform: uppercase;
  background: #fff;
  margin-bottom: 5px;
  transition: all 0.3s ease-in-out;
}

#portfolio #portfolio-flters li:hover,
#portfolio #portfolio-flters li.filter-active {
  background: #18d26e;
  color: #fff;
}

#portfolio #portfolio-flters li:last-child {
  margin-right: 0;
}

#portfolio .portfolio-wrap {
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

#portfolio .portfolio-wrap:hover {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.16);
}

#portfolio .portfolio-item {
  position: relative;
  height: 360px;
  overflow: hidden;
}

#portfolio .portfolio-item figure {
  background: #000;
  overflow: hidden;
  height: 240px;
  position: relative;
  border-radius: 4px 4px 0 0;
  margin: 0;
}

#portfolio .portfolio-item figure:hover img {
  opacity: 0.4;
  transition: 0.3s;
}

#portfolio .portfolio-item figure .link-preview,
#portfolio .portfolio-item figure .link-details {
  position: absolute;
  display: inline-block;
  opacity: 0;
  line-height: 1;
  text-align: center;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 50%;
  transition: 0.2s linear;
}

#portfolio .portfolio-item figure .link-preview i,
#portfolio .portfolio-item figure .link-details i {
  padding-top: 6px;
  font-size: 22px;
  color: #333;
}

#portfolio .portfolio-item figure .link-preview:hover,
#portfolio .portfolio-item figure .link-details:hover {
  background: #18d26e;
}

#portfolio .portfolio-item figure .link-preview:hover i,
#portfolio .portfolio-item figure .link-details:hover i {
  color: #fff;
}

#portfolio .portfolio-item figure .link-preview {
  left: calc(50% - 38px);
  top: calc(50% - 18px);
}

#portfolio .portfolio-item figure .link-details {
  right: calc(50% - 38px);
  top: calc(50% - 18px);
}

#portfolio .portfolio-item figure:hover .link-preview {
  opacity: 1;
  left: calc(50% - 44px);
}

#portfolio .portfolio-item figure:hover .link-details {
  opacity: 1;
  right: calc(50% - 44px);
}

#portfolio .portfolio-item .portfolio-info {
  background: #fff;
  text-align: center;
  padding: 30px;
  height: 90px;
  border-radius: 0 0 3px 3px;
}

#portfolio .portfolio-item .portfolio-info h4 {
  font-size: 18px;
  line-height: 1px;
  font-weight: 700;
  margin-bottom: 18px;
  padding-bottom: 0;
}

#portfolio .portfolio-item .portfolio-info h4 a {
  color: #333;
}

#portfolio .portfolio-item .portfolio-info h4 a:hover {
  color: #18d26e;
}

#portfolio .portfolio-item .portfolio-info p {
  padding: 0;
  margin: 0;
  color: #b8b8b8;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
}

/* Team Section
--------------------------------*/

#team {
  background: #fff;
  padding: 60px 0;
}

#team .member {
  text-align: center;
  margin-bottom: 20px;
  background: #000;
  position: relative;
}

#team .member .member-info {
  opacity: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  transition: 0.2s;
}

#team .member .member-info-content {
  margin-top: -50px;
  transition: margin 0.2s;
}

#team .member:hover .member-info {
  background: rgba(0, 0, 0, 0.7);
  opacity: 1;
  transition: 0.4s;
}

#team .member:hover .member-info-content {
  margin-top: 0;
  transition: margin 0.4s;
}

#team .member h4 {
  font-weight: 700;
  margin-bottom: 2px;
  font-size: 18px;
  color: #fff;
}

#team .member span {
  font-style: italic;
  display: block;
  font-size: 13px;
  color: #fff;
}

#team .member .social {
  margin-top: 15px;
}

#team .member .social a {
  transition: none;
  color: #fff;
}

#team .member .social a:hover {
  color: #18d26e;
}

#team .member .social i {
  font-size: 18px;
  margin: 0 2px;
}
#team .member img {
  max-width: 200px;
}

/*--------------------------------------------------------------
# Footer
--------------------------------------------------------------*/

#footer {
  background: #000;
  padding: 0 0 30px 0;
  color: #eee;
  font-size: 14px;
  padding: 0 1em 3em;
}

#footer .footer-top {
  background: #111;
  padding: 60px 0 30px 0;
}

#footer .footer-top .footer-info {
  margin-bottom: 30px;
}

#footer .footer-top .footer-info h3 {
  font-size: 34px;
  margin: 0 0 20px 0;
  padding: 2px 0 2px 10px;
  line-height: 1;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
  border-left: 4px solid #18d26e;
}

#footer .footer-top .footer-info p {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 0;
  font-family: "Montserrat", sans-serif;
  color: #eee;
}

#footer .footer-top .social-links a {
  font-size: 18px;
  display: inline-block;
  background: #333;
  color: #eee;
  line-height: 1;
  padding: 8px 0;
  margin-right: 4px;
  border-radius: 50%;
  text-align: center;
  width: 36px;
  height: 36px;
  transition: 0.3s;
}

#footer .footer-top .social-links a:hover {
  background: #18d26e;
  color: #fff;
}

#footer .footer-top h4 {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 12px;
}

#footer .footer-top h4::before,
#footer .footer-top h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
}

#footer .footer-top h4::before {
  right: 0;
  background: #555;
}

#footer .footer-top h4::after {
  background: #18d26e;
  width: 60px;
}

#footer .footer-top .footer-links {
  margin-bottom: 30px;
}

#footer .footer-top .footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#footer .footer-top .footer-links ul i {
  padding-right: 8px;
  color: #ddd;
}

#footer .footer-top .footer-links ul li {
  border-bottom: 1px solid #333;
  padding: 10px 0;
}

#footer .footer-top .footer-links ul li:first-child {
  padding-top: 0;
}

#footer .footer-top .footer-links ul a {
  color: #eee;
}

#footer .footer-top .footer-links ul a:hover {
  color: #18d26e;
}

#footer .footer-top .footer-contact {
  margin-bottom: 30px;
}

#footer .footer-top .footer-contact p {
  line-height: 26px;
}

#footer .footer-top .footer-newsletter {
  margin-bottom: 30px;
}

#footer .footer-top .footer-newsletter input[type="email"] {
  border: 0;
  padding: 6px 8px;
  width: 65%;
}

#footer .footer-top .footer-newsletter input[type="submit"] {
  background: #18d26e;
  border: 0;
  width: 35%;
  padding: 6px 0;
  text-align: center;
  color: #fff;
  transition: 0.3s;
  cursor: pointer;
}

#footer .footer-top .footer-newsletter input[type="submit"]:hover {
  background: #13a456;
}

#footer .copyright {
  text-align: center;
  padding-top: 30px;
}

#footer .credits {
  text-align: center;
  font-size: 13px;
  color: #ddd;
}

#footer {
  .footer-info,
  .footer-contact {
    max-width: 300px;
    margin: 0 auto;
  }
}

.about-title-content {
  max-width: 760px;
  margin: 0 auto;
  text-align: left;
}

.mission {
  text-align: center;
}
/*--------------------------------------------------------------
# Responsive Media Queries
--------------------------------------------------------------*/

@media (min-width: 768px) {
  #contact .contact-address,
  #contact .contact-phone,
  #contact .contact-email {
    padding: 20px 0;
  }

  #contact .contact-phone {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
}

@media (min-width: 992px) {
  #testimonials .testimonial-item p {
    width: 80%;
  }
}

@media (min-width: 1024px) {
  #header #logo {
    padding-left: 60px;
  }

  #intro p {
    width: 60%;
  }

  #intro .carousel-control-prev,
  #intro .carousel-control-next {
    width: 5%;
  }

  #nav-menu-container {
    padding-right: 60px;
  }
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 15px;
  }

  #header #logo h1 {
    font-size: 28px;
  }

  #header #logo img {
    max-height: 40px;
  }

  #intro h2 {
    font-size: 28px;
  }

  #nav-menu-container {
    display: none;
  }

  #mobile-nav-toggle {
    display: inline;
  }
}
</style>
