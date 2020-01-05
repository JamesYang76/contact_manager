// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

//require("@rails/ujs").start()
import Rails from "@rails/ujs"
window.Rails = Rails
Rails.start();

require("@rails/activestorage").start()
require("channels")

require("jquery")
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');



import toastr from 'toastr'
window.toastr = toastr;

import 'spin.js'



import '../stylesheets/application'

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


$(function() {

  $('#term').autocomplete({
      source: "/contacts/autocomplete",
      minLength: 3,
      select: function (event, ui) {
        $('#term').val(ui.item.value);
        $(this).closest('form').submit();
      }
    });

  $("#add-new-group").hide();

  $('body').on('click','#add-group-btn', function () {
    $("#add-new-group").slideToggle(function() {
      $('#new_group').focus();
    });
    return false;
  });

  $("body").on('click','#save-group-btn', function (event) {
    event.preventDefault();

    var newGroup = $('#new_group');
    var inputGroup = newGroup.closest('.input-group');

    $.ajax({
      url: "/groups",
      method: "post",
      data: {
        group: { name: $("#new_group").val() }
      },
      success: function (group) {
        if(group.id != null) {
          inputGroup.removeClass('has-error');
          inputGroup.next('.text-danger').remove();

          var newOption = $('<option />')
            .attr('value', group.id)
            .attr('selected', true)
            .text(group.name);

          $('#contact_group_id').append(newOption);
          newGroup.val("");
        }
      },
      error: function (xhr) {
        var errors = xhr.responseJSON;
        var error = errors.join(", ")
        if (error) {
          inputGroup.next('.text-danger').detach();
          inputGroup
            .addClass('has-error')
            .after('<p class="text-danger">' + error + '</p>');
        }
      }
    });
  });

  window.toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  $( ".pagination a[data-remote=true], a.list-group-item").click(function() {
    history.pushState({},'', $(this).attr('href'));
  });

  $(window).on('popstate', function () {
   // $.get(document.location.href);
    $.get(document.location.href,
    function( data ) {

    });
  });


  $('#form-modal-save-btn').click(function () {
    //$('#new_contact').submit();
    // $('#new_contact').ajaxSubmit();
   // var form = document.querySelector('#new_contact');

    var form = $('#form-modal-body').find('form')[0];
    Rails.fire(form, 'submit');
  });

});


