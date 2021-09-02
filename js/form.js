$(document).ready(function () {


  var len;
  var data;
  var x;
  var count;
  var current;
  var percent;

  $.when(
    $.ajax({
      type: "GET",
      url: "documents/MiniAssessment.csv",
      dataType: "text",
      success: function (response) {
        data = $.csv.toObjects(response);
        console.log(data);
        len = data.length;
        console.log(len);
      },
    })).then(function () {


      for (var i = 1; i <= len; i++) {

        var container, content;
        container = jQuery('.form');

        if (i == 1) {
          document.querySelector('#question-count').innerText = `Question 1 of ${len}`;
          content = '<div class="mm-survey-page active" data-page="' + i + '">' +
            '<div class="mm-survery-content">' +
            '<div class="mm-survey-question"><p>' + data[i - 1].question + ' <a tab-index="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="right" data-bs-content="' + data[i - 1].helptext + '"><i class="far fa-question-circle"></i></a></p></div>' +
            '</div>' +
            '</div>';

        }
        else {
          content = '<div class="mm-survey-page" data-page="' + i + '">' +
            '<div class="mm-survery-content">' +
            '<div class="mm-survey-question"><p>' + data[i - 1].question + ' <a tab-index="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="right" data-bs-content="' + data[i - 1].helptext + '"><i class="far fa-question-circle"></i></a></p></div>' +
            '</div>' +
            '</div>';

        }
        container.append(content);

        for (var ii = 1; ii <= 4; ii++) {

          var datax, containerx, contentx;
          valuex = ['responseA', 'responseB', 'responseC', 'responseD'];
          datax = [data[i - 1].responseA, data[i - 1].responseB, data[i - 1].responseC, data[i - 1].responseD];
          containerx = jQuery('[data-page="' + i + '"] .mm-survery-content');


          contentx = '<div class="mm-survey-item">' +
            '<input type="radio" id="radio' + i + '0' + ii + '" data-item="' + ii + '" name="radio' + i + '" value="' + valuex[ii - 1] + '" required/>' +
            '<label for="radio' + i + '0' + ii + '"><span></span><p>' + datax[ii - 1] + '</p></label>' +
            '</div>';

          containerx.append(contentx);

        }



      }



      jQuery('.mm-prev-btn .prev').css({ visibility: 'hidden' });
      jQuery("#final-submit").css("display", "none");
      jQuery('.mm-next-btn .next').attr('disabled', 'disabled');


      init();
      getCurrentSlide();
      goToNext();
      goToPrev();
      getCount();
      // checkStatus();
      // buttonConfig();
      buildProgress((1 / count));
      buildStatus();
      deliverStatus();



      function init() {


        jQuery("form.form .mm-survey-page").each(function () {

          var item;
          var page;

          item = jQuery(this);
          page = item.data('page');
          item.addClass('mm-page-' + page);
          //item.html(page);

        });

      }

      function getCount() {
        count = jQuery("form.form .mm-survey-page").length;
        console.log(count);
        return count;
      }

      function getCurrentSlide() {
        jQuery('.mm-survey-page').each(function () {

          var item;

          item = jQuery(this);

          if (jQuery(item).hasClass('active')) {
            x = item.data('page');
          }
          return x;

        });

      }

      function goToNext() {

        jQuery('.mm-next-btn .next').on('click', function () {
          goToSlide(x);
          getCount();
          current = x + 1;
          var g = current / (count);
          buildProgress(g);
          getButtons();

          jQuery('.mm-survey-page').removeClass('active');
          jQuery('.mm-page-' + current).addClass('active');
          if (current >= 2) {

            document.querySelector('#question-count').innerText = `Question ${current} of ${count}`;
          }
          else if (current === 1) {

            document.querySelector('#question-count').innerText = `Question ${current} of ${count}`;
          }

          if (current === count) {
            jQuery('#final-submit').css("display", "block");
            jQuery('.mm-next-btn').css("display", "none");
            jQuery('#nav-next').css("display", "block");
            jQuery('#nav-next').css({ visibility: 'hidden'});
          }
          getCurrentSlide();
          checkStatus();

          if (jQuery('.mm-page-' + count).hasClass('active')) {
            jQuery('.final-submit').css({ visibility: 'visible' });
          }
          else {
            if (jQuery('.mm-page-' + current).hasClass('pass')) {

              jQuery('.mm-survey-container').addClass('good');
              jQuery('.mm-survey').addClass('okay');
            }
            else {
              jQuery('.mm-survey-container').removeClass('good');
              jQuery('.mm-survey').removeClass('okay');
            }
          }
          buttonConfig();

        });

      }


      function goToPrev() {

        jQuery('.mm-prev-btn .prev').on('click', function () {
          goToSlide(x);
          getCount();
          current = (x - 1);

          var g = current / (count);
          buildProgress(g);
          getButtons();
          jQuery('.mm-survey-page').removeClass('active');
          jQuery('.mm-page-' + current).addClass('active');

          jQuery('#final-submit').css("display","none" );
          jQuery('.mm-next-btn').css("display","block" );
          jQuery('#nav-next').css({ visibility: 'visible' });

          if (current >= 2) {

            document.querySelector('#question-count').innerText = `Question ${current} of ${count}`;
          }
          else if (current === 1) {

            document.querySelector('#question-count').innerText = `Question ${current} of ${count}`;
          }
          getCurrentSlide();
          checkStatus();
          if (jQuery('.mm-page-' + current).hasClass('pass')) {
            jQuery('.mm-survey-container').addClass('good');
            jQuery('.mm-survey').addClass('okay');
          }
          else {
            jQuery('.mm-survey-container').removeClass('good');
            jQuery('.mm-survey').removeClass('okay');
          }
          buttonConfig();
        });

      }

      function buildProgress(g) {

        if (g > 1) {
          g = g - 1;
        }
        else if (g === 0) {
          g = 1;
        }
        g = g * 100;
        jQuery('.mm-survey-progress-bar').css({ 'width': g + '%' });

      }

      function goToSlide(x) {

        return x;

      }



      function getButtons() {

        if (current == 1) {
          jQuery('.mm-prev-btn .prev').css({ visibility: 'hidden' });
          jQuery('.mm-next-btn .next').attr('disabled', 'disabled');
        }
        else {
          jQuery('.mm-next-btn .next').css({ visibility: 'visible' });
          jQuery('.mm-prev-btn .prev').css({ visibility: 'visible' });
        }

      }

      jQuery('.mm-survey-q li input').each(function () {

        var item;
        item = jQuery(this);

        jQuery(item).on('click', function () {
          if (jQuery('input:checked').length > 0) {
            // console.log(item.val());
            jQuery('label').parent().removeClass('active');
            item.closest('li').addClass('active');
          }
          else {
            //
          }
        });

      });


      function checkStatus() {

        jQuery('.mm-survery-content .mm-survey-item').on('click', function () {
          var item;
          item = jQuery(this);
          item.closest('.mm-survey-page').addClass('pass');

        });
        buttonConfig();
      }

      function buildStatus() {

        jQuery('.mm-survery-content .mm-survey-item').on('click', function () {
          var item;
          item = jQuery(this);
          item.closest('.mm-survey-page').addClass('pass');
          jQuery('.mm-survey-container').addClass('good');
        });

      }

      function deliverStatus() {

        jQuery('.mm-survey-item').on('click', function () {
          if (jQuery('.mm-survey-container').hasClass('good')) {
            jQuery('.mm-survey').addClass('okay');
          }
          else {
            jQuery('.mm-survey').removeClass('okay');
          }
          buttonConfig();
        });


      }



      function buttonConfig() {
        if (current == count) {
          jQuery('.mm-next-btn button').css({ visibility: 'hidden' });
          jQuery('.mm-next-btn button').css({ visibility: 'hidden' });

          jQuery('.mm-next-btn button').attr('disabled', 'disabled');
          jQuery('.mm-next-btn .next svg').attr('disabled', 'disabled');
          jQuery('.mm-next-btn button').css({ opacity: 0.3 });
          jQuery('.mm-next-btn .next svg').css({ opacity: 0.3 });
        }
        else if (jQuery('.mm-survey').hasClass('okay')) {
          jQuery('.mm-next-btn button').removeAttr('disabled', 'disabled');
          jQuery('.mm-next-btn .next svg').removeAttr('disabled', 'disabled');
          jQuery('.mm-next-btn button').css({ opacity: 1 });
          jQuery('.mm-next-btn .next svg').css({ opacity: 1 });


        }
        else {

          jQuery('.mm-next-btn button').attr('disabled', 'disabled');
          jQuery('.mm-next-btn .next svg').attr('disabled', 'disabled');
          jQuery('.mm-next-btn button').css({ opacity: 0.3 });
          jQuery('.mm-next-btn .next svg').css({ opacity: 0.3 });
        }
      }
      var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
      })
    });
});