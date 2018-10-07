//файл отвечает за валидацию формы
'use strict';

$(document).ready(function() {

  // задаем "флажки", которые отвечают за валидность полей
  var validName       = false,
      validSecondName = false,
      validEmail      = false,
      validPassword   = false,
      validConditions = false;

  // проверяет валидность заданого поля
  function validCheck(field, valid) {
    if(field.val().trim().length == 0) {
      field.addClass('is-invalid');
      field.parent().next('.field-invalid').slideDown('fast');
      valid = false;
    } else {
      field.removeClass('is-invalid');
      field.parent().next('.field-invalid').slideUp('fast');
      valid = true;
    }
    return valid;
  };

  // проверяем форму после её попытки отправиться
  $('form').on('submit', function(e) {

    //запрещаем отправку формы, пока она не пройдет валидность
    event.preventDefault();

    var fieldName       = $('#userName'),
        fieldSecondName = $('#userSecondName'),
        fieldEmail = $('#email'),
        fieldPassword = $('#password'),
        fieldConditions = $('#conditions').prop('checked');

    //проверяем поля формы на валидность
    validName = validCheck(fieldName, validName);
    validSecondName = validCheck(fieldSecondName, validSecondName);
    validEmail = validCheck(fieldEmail, validEmail);
    validPassword =  validCheck(fieldPassword, validPassword);
    validConditions = fieldConditions;

    //проверяем checkbox на валидность
    if(fieldConditions == false) {
      $('#conditions').parent().next('.field-invalid--conditions').slideDown('fast');
      $('#conditions').next('label').css('color', '#dc3545');
    } else {
      $('#conditions').parent().next('.field-invalid--conditions').slideUp('fast');
      $('#conditions').next('label').css('color', 'inherit');
    }

    //если все поля валидны, запрашиваем ответ-json у сервера
    if(validName == true && validSecondName == true && validEmail== true && validPassword == true && validConditions == true) {

      //осуществляем запрос к серверу, без перезагрузки страницы
      $.post('http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration', $(this).serialize(), function(formResult) {

        //проверяет, вернул ли сервер поле, в котором есть ошибка
        function fieldServer(field) {
          if(field.attr('name') == formResult.field) {
            field.addClass('is-invalid');
            field.parent().next('.field-invalid').text(formResult.message).slideDown('fast');
          } else {
            field.removeClass('is-invalid');
            field.parent().next('.field-invalid').slideUp('fast');
          }
        };

        //если сервер вернул статус отличный от "ОК", то выводим текст ошибки
        if(formResult.status !== 'OK') {

          if(formResult.field) {
            fieldServer(fieldName);
            fieldServer(fieldSecondName);
            fieldServer(fieldEmail);
            fieldServer(fieldPassword);
          } else {

            //если сервер не вернул поле, выводим ошибку вначале формы
            $('form').prepend('<div class="field-invalid" style="margin-bottom: 10px">' + formResult.message + '</div>');
            $('form .field-invalid:first').slideDown('fast');
          }

        //если сервер вернул статус "ОК", то переъодим на страницу компаний
        } else {
          window.location.href = 'https://www.google.com.ua'
        }

      });  
    }
  });
});