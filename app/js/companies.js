'use strict';

$(document).ready(function() {

  // убирает прелоадер
  function hidePreloader(preloader) {
    setTimeout(function() {
      $(preloader).fadeOut();
    }, 800);
  };

  // получаем данные компаний с серера
  $.getJSON('http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList', function(companies) {
    if(companies.status == 'OK') {

    // записываем количество компаний в блок "Total Companies"
    $('.sumCompanies').text(companies.list.length);

    // как записались данные в блок "Total Companies", прячем на нем прелоадер
    hidePreloader($('.preloaderTotal'));

    // создаем элементы списка в блоке "List of Companies"
    $(companies.list).each(function(i, listCompanies) {
      $('.listCompanies ul').prepend('<a href="#" class="list-group-item list-group-item-action">' + listCompanies.name + '</a>');
    });

    // как записались данные в блок "List of Companies", прячем на нем прелоадер
    hidePreloader($('.preloaderList'));

    var sumCountries    = {},
        listCountries   = [];

    // переменная listCountries хранит список стран
    $(companies.list).each(function(i, item) {
      listCountries.push(item.location.name);
    });

    // переменная sumCountries хранит сколько раз повторяется каждая страна
    sumCountries = listCountries.reduce(function(nameCountry, i) {
      nameCountry[i] = (nameCountry[i] || 0) + 1;
      return nameCountry;
    }, {});

    //строит груговою диаграмму
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
    }
  });

});