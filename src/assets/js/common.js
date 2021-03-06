$(function () {
    $('.inputDiv input').focusout(function () {
        var text_val = $(this).val();
        if (text_val === "") {
            $(this).removeClass('has-value');
        } else {
            $(this).addClass('has-value');
        }
    });
});










$(document).ready(function () {
    $('select').css('color', 'transparent');
    $('select option').css('color', '#000');
    $('select').change(function () {
        if ($(this).val() !== "") {
            $(this).css('color', '#000');
            $(this).addClass('has-value');
        } else {
            $(this).css('color', 'transparent');
            $(this).removeClass('has-value');
        }
    });

    $('.inputDiv input, .inputDiv select, .inputDiv textarea').focusin(function () {
        $(this).parent().addClass('is-focused');
    });

    $('.inputDiv input, .inputDiv select, .inputDiv textarea').focusout(function () {
        $(this).parent().removeClass('is-focused');
    });





    $('#signUp').click(function () {
        $('#container').addClass('right-panel-active');
        $('.selection').slideUp();
        $('#referrerdiv').slideUp();
        $("#bike").prop('checked', true);
        $("#bank").prop('checked', false);
        $("#referrer").prop('checked', false);

    });

    $('#signIn').click(function () {
        $('#container').removeClass('right-panel-active');
    });

    $('#btnForgot').click(function () {
        $('#logindiv').slideUp();
        $('#ForgotPassworddiv').slideDown();
    });
    $('#btnLogin').click(function () {
        $('#ForgotPassworddiv').slideUp();
        $('#logindiv').slideDown();
    });
    $('select').css('color', 'transparent');
    $('select option').css('color', '#000');
    $('.selection').slideUp();
    $(".radio-tile-group input[name='radio']").click(function () {
        var radioValue = $("input[name='radio']:checked").val();

        if (radioValue == "bank") {
            $('.selection').slideDown();
        } else {
            $('.selection').slideUp();
        }

        if (radioValue == "referrer") {
            $('#referrerdiv').slideDown();
        } else {
            $('#referrerdiv').slideUp();
        }
    });

    demo.initDashboardPageCharts();
    demo.initVectorMap();
});

$('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
 });

 $(function(){
    // prettyPrint();
    $("#menu-bar").click(function(){
    var id = $(this).attr("href").substring(1);
    $("html, body").animate({ scrollTop: $("#"+id).offset().top }, 1000, function(){
    $("#menu-bar").slideReveal("hide");
    });
    });
    var slider = $("#menu-bar").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handle"),
    // autoEscape: false,
    shown: function(obj){
    obj.find(".handle").html('<span class="fas fa-times"></span>');
    obj.addClass("left-shadow-overlay");
    },
    hidden: function(obj){
    obj.find(".handle").html('<span class="fas fa-angle-left"></span>');
    obj.removeClass("left-shadow-overlay");
    }
    });
    });