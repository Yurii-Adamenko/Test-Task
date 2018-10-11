'use strict';

var listCompanies = [];

$(document).ready(function() {

  // убирает прелоадер
  function hidePreloader(preloader) {
    setTimeout(function() {
      $(preloader).fadeOut();
    }, 800);
  };

  // делает активной кнопку сортировки, на которую нажали
  function clickBtnSort(btn) {
    $('.partnersList').empty();
    $('.sortBtn').removeClass('sortBtnActive');
    $(btn).addClass('sortBtnActive');
  };

  // строит список партнеров
  function buildPartnersBlock(list, btn) {
    $(list).each(function() {
      $(this).each(function() {
        $('.partnersList').append('<li class="partnersItem">' + this.name + '<span class="partnersPercent">'+ this.value + '%</span></li>');
        });
    });
  };

  // получаем данные компаний с сервера
  $.getJSON('http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList', function(companies) {

    if(companies.status == 'OK') {

      var sumCountries  = {},
          listCountries = [];

      // записываем количество компаний в блок "Total Companies"
      $('.sumCompanies').text(companies.list.length);

      // как записались данные в блок "Total Companies", прячем на нем прелоадер
      hidePreloader($('.preloaderTotal'));

      // создаем элементы списка в блоке "List of Companies"
      $(companies.list).each(function(i, company) {
        $('.listCompanies ul').append('<a href="#" class="list-group-item list-group-item-action">' + company.name + '</a>');
        listCompanies.push(company);
      });

      // как записались данные в блок "List of Companies", прячем на нем прелоадер
      hidePreloader($('.preloaderList'));

      // нажали на компанию в списке
      $('.listCompanies ul a').on('click', function() {
        
        var partners    = [],
            nameCompany = $(this);

        // отменяем работу <a>
        event.preventDefault();
        // очищаем список партнеров, которые уже были
        $('.partnersList').empty();
        // Показываем блок "Company partners"
        $('.partnersBlock').slideDown('slow');
        // Скрываем блок "Company partners"
        $('.exit').on('click', function() {
          $('.partnersBlock').slideUp('slow');
          // что б при нажатии на кнопку страница не обновлялась
          return false;
        });

        // выделяем элемент списка на который нажали
        if($('.listCompanies ul a').hasClass('active')) {
          $('.listCompanies ul a').removeClass('active');
          $(this).addClass('active');
        } else {  
          $(this).addClass('active');
        };

        // формируем список партнеров компании, на которую нажали
        $(listCompanies).each(function() {
          if(this.name === nameCompany.text()) {
            partners = partners.concat(this.partners)
          } 
        });

        // нажали на сортировку по имени вверх
        $('.sortNameBtnUp').on('click', function() {
          clickBtnSort(this);
          partners.sort(function (a, b) {
            if (a.name > b.name) {
              return -1;
            }
            if (a.name < b.name) {
              return 1;
            }
            return 0;
          });
          buildPartnersBlock(partners, this);
        });

        // если кнопка сортироки по имени вверх нажата, строим список партнеров (это применится, если сменить компанию, но выбраный фильтр сохранится)
        // ниже применяются аналогичные действия для других кнопок сортировки
        if($('.sortNameBtnUp').hasClass('sortBtnActive')) {
          partners.sort(function (a, b) {
            if (a.name > b.name) {
              return -1;
            }
            if (a.name < b.name) {
              return 1;
            }
            return 0;
          });
          buildPartnersBlock(partners, $('.sortNameBtnUp'));
        };

        $('.sortNameBtnDown').on('click', function() {
          clickBtnSort(this);
          partners.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
          buildPartnersBlock(partners, this);
        });

        if($('.sortNameBtnDown').hasClass('sortBtnActive')) {
          partners.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
          buildPartnersBlock(partners, $('.sortNameBtnDown'));
        };

        $('.sortPercBtnUp').on('click', function() {
          clickBtnSort(this);
          partners.sort(function (a, b) {
            if (a.value > b.value) {
              return 1;
            }
            if (a.value < b.value) {
              return -1;
            }
            return 0;
          });
          buildPartnersBlock(partners, this);
        });

        if($('.sortPercBtnUp').hasClass('sortBtnActive')) {
          partners.sort(function (a, b) {
            if (a.value > b.value) {
              return 1;
            }
            if (a.value < b.value) {
              return -1;
            }
            return 0;
          });
          buildPartnersBlock(partners, $('.sortPercBtnUp'));
        };

        $('.sortPercBtnDown').on('click', function() {
          clickBtnSort(this);
          partners.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
          });
          buildPartnersBlock(partners, this);
        });

        if($('.sortPercBtnDown').hasClass('sortBtnActive')) {
          partners.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
          });
          buildPartnersBlock(partners, $('.sortPercBtnDown'));
        };

      });

      // переменная listCountries хранит список стран
      $(companies.list).each(function(i, item) {
        listCountries.push(item.location.name);
      });

      // переменная sumCountries хранит сколько раз повторяется каждая страна
      sumCountries = listCountries.reduce(function(nameCountry, i) {
        nameCountry[i] = (nameCountry[i] || 0) + 1;
        return nameCountry;
      }, {});

      // строит круговою диаграмму
      $(function() {
        // переменная хранит данные для постройки графика
        var data = [];

        // в переменную data записываются страны с количеством их повторений
        for (var key in sumCountries) {
          data.push({label: key, data: sumCountries[key]});
        };
        
        var graph = $("#graph");
        graph.unbind();

        $.plot(graph, data, {
          series: {
            pie: { 
              show: true
            }
          },
          legend: {
            show: false
          }
        });
      });

      // как записались данные в блок "Companies by Location", прячем на нем прелоадер
      hidePreloader($('.preloaderLocation'));

    // если не получили данные, перезагружаем страницу
    } else {
      location.reload(true);
    };

  });

  // получаем данные новостей с сервера
  $.getJSON('http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList', function(newsList) {

    if(newsList.status == 'OK') {

      // стром слайдер по получим данным 
      $(newsList.list).each(function(i, news) {

        // форматируем дату в нужный вид
        var date = new Date(news.date * 1000);
        date = moment(date).format("DD.MM.YYYY");

        // добавляем индикаторы слайдера
        $('.carousel-indicators').append('<li data-target="#carouselIndicators" data-slide-to="' + i + '"></li>');

        // добавляем элементы слайдера
        // заметка: картинки строем с помощью background, что б центровать их вне зависимости от размера полученой картинки. К тому же так лучше при использовании CMS
        $('.carousel-inner').append('<div class="carousel-item"><div class="newsContent"><div class="newsMedia"><div class="newsImage"><div style="background-image: url(' + news.img.replace(/"/g,'') + ')"></div></div><div class="newsAuthor"><span>Author:</span>' + news.author + '</div><div class="newsPublic"><span>Public:</span>' + date + '</div></div><div class="newsText"><a href=' + news.link + '><span class="newsTitle">Title</span></a><p class="newsDescription">' + news.description + '</p></div></div></div>');

      });

      // первому индикатору и элементу слайдера добавляем класс('active'), что б слайдер работал
      $('.carousel-indicators li:first-child').addClass('active');
      $('.carousel-item:first-child').addClass('active');

      // когда слайдер построился, прячем прелоадер
      hidePreloader($('.preloaderNews'));

    } else {
      location.reload(true);
    };

  });

});

//когда окно загрузилось, можем работать с элементами круговой диаграммы (ниже идет работа с этой диаграмой)
$(window).on('load', function() {
  
  // нажали на страну
  $('.pieLabel').on('click', function() {

    // с нажатой страны на диаграмме взяли текст и оставили только название страны 
    var nameCountry = $(this).text();
    nameCountry = nameCountry.replace(/\d.*/, '');

    // берем компании, которые относятся к нажатой стране и строим список
    $(listCompanies).each(function() {
      if(nameCountry == this.location.name) {
        $('.graphList').append('<li class="list-group-item">' + this.name + '</li>');
      }

    });

    // для коректного отображения при разной величине списка, вносим в него небольшие визуальные изменения
    if($('.graphList li').length <= 4) {
      $('.graphList').css({'height':'inherit', 'border-right':'0'});
    }

    // прячем график, показываем список и кнопку "назад"
    $('.graphContainer').hide();
    $('.graphBack').show();
    $('.graphListContainer').show();

    // при клике на кнопку "назад", возвращаем все в диаграмме к начальным значениям
    $('.graphBack').on('click', function() {
      $(this).hide();
      $('.graphListContainer').hide();
      $('.graphContainer').show();
      $('.graphList li').remove();
      $('.graphList').css({'height':'100%', 'border-right':'inherit'});
    });

  });

});


