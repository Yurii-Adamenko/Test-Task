'use strict';

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

      var listCompanies = [],
          sumCountries  = {},
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
        // отменяем работу <a>
        event.preventDefault();
        // очищаем список партнеров, которые уже были
        $('.partnersList').empty();
        // Показываем блок "Company partners"
        $('.partnersBlock').slideDown('slow');
        // Скрываем блок "Company partners"
        $('.exit').on('click', function() {
          $('.partnersBlock').slideUp('slow');
        });

        var partners = [],
            nameCompany = $(this);

        // выделяем элемент списка на который нажали
        if($('.listCompanies ul a').hasClass('active')) {
          $('.listCompanies ul a').removeClass('active');
          $(this).addClass('active');
        } else {  
          $(this).addClass('active');
        };

        //формируем список партнеров компании, на которую нажали
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

      //строит круговою диаграмму
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

    } else {
      location.reload(true);
    };

  });

});