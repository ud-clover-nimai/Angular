
export function loadFilestyle(){
    $(document).ready(function() {
        $("input[id^='upload_file']").each(function() {
            var id = parseInt(this.id.replace("upload_file", ""));
            $("#upload_file" + id).change(function() {
                if ($("#upload_file" + id).val() != "") {
                    
                }
            });
        });
    });
    
    $(document).ready(function() {
        var upload_number = 2;
        $('#attachMore').click(function() {
            //add more file
            var moreUploadTag = '';
            //moreUploadTag += '<div class="element"><label for="upload_file"' + upload_number + '>Upload File ' + upload_number + '</label>';
            moreUploadTag += '<input type="file"  class="filestyle" (change)="selectFile($event)" data-icon="false" id="upload_file' + upload_number + '" name="upload_file' + upload_number + '"/>';
            moreUploadTag += ' <a href="javascript:del_file(' + upload_number + ')" style="cursor: pointer;position: absolute;right: 0px;top: 9px;color: #ff6464;font-size: 14px;" class="attachMore" onclick="return confirm("Are you really want to delete ?")"><i class="fas fa-trash-alt"></i></a></div>';
            $('<dl class="deletefile" id="delete_file' + upload_number + '">' + moreUploadTag + '</dl>').fadeIn('slow').appendTo('#moreImageUpload');
            upload_number++;
    
    
            $('#upload_file2, #upload_file3, #upload_file4, #upload_file5, #upload_file6').filestyle();
    
        });

    //to show aactive page    
   const currentLocation = location.href;
   const menuItem = document.querySelectorAll('a');
   const menuLength = menuItem.length
   for (let i = 0; i<menuLength; i++){
       if(menuItem[i].href === currentLocation){
           menuItem[i].className = "active"
       }
   }
    
      
    
    });
    
    function del_file(eleId) {
        var ele = document.getElementById("delete_file" + eleId);
        ele.parentNode.removeChild(ele);
    }
}
export function selectpickercall() {
    //    Activate bootstrap-select
    console.log('select  picker')
   
    console.log($(".selectpicker").length);
    if ($(".selectpicker").length != 0) {
        
        $(".selectpicker").selectpicker();
    }

}
export function load_dashboard() {
    var sidebar_mini=false
    if($('body').hasClass('sidebar-mini')){
        sidebar_mini = true;
    }
    $("#minimizeSidebar").click(function(){
       if(sidebar_mini==true){
        $('body').removeClass('sidebar-mini');
        sidebar_mini=false;
       }else{
        $('body').addClass('sidebar-mini');
        sidebar_mini=true;
       }
    })
}
export function loads() {
    const inputs = $('.inputDiv').find('input');
    for (let input of inputs) {
        var text_val = $(input).val();
        if (text_val === "") {
            $(input).removeClass('has-value');
        } else {
            $(input).addClass('has-value');
        }
    };

    const selects = $('.inputDiv').find('select')
    for (let select of selects) {
        var text_val = $(select).val();
        if (text_val === "") {
            $(select).css('color', '#000');
            $(select).removeClass('has-value');
        } else {
            $(select).css('color', '#000');
            $(select).addClass('has-value');
        }
    };


    $(function () {
        $('.inputDiv input').focusout(function () {
            var text_val = $(this).val();
            if (text_val === "") {
                $(this).removeClass('has-value');
            } else {
                $(this).addClass('has-value');
            }
        });
        $('.inputDiv select').focusout(function () {
            var text_val = $(this).val();
            if (text_val === "") {
                $(this).addClass('has-value');
            } else {
                $(this).addClass('has-value');
            }
        });
    });


    //check input box val
   $(function (){
       $('inputDiv input').val("");
       $('inputDiv input').focusout(function (){
           if($(this).val() != ""){
               $(this).addClass('has-content');
           }else{
               $(this).removeClass('has-content');
           }
           
       })
   });


    $('select').css('color', 'transparent');
    $('select option').css('color', 'black');
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

    $("[data-toggle='tooltip']").tooltip();

}

export function errorPage404() {
    function randomNum() {
        "use strict";
        return Math.floor(Math.random() * 9) + 1;
    }
    var loop1, loop2, loop3, time = 30, i = 0, number, selector3 = document.querySelector('.thirdDigit'), selector2 = document.querySelector('.secondDigit'),
        selector1 = document.querySelector('.firstDigit');
    loop3 = setInterval(function () {
        "use strict";
        if (i > 40) {
            clearInterval(loop3);
            selector3.textContent = 4;
        } else {
            selector3.textContent = randomNum();
            i++;
        }
    }, time);
    loop2 = setInterval(function () {
        "use strict";
        if (i > 80) {
            clearInterval(loop2);
            selector2.textContent = 0;
        } else {
            selector2.textContent = randomNum();
            i++;
        }
    }, time);
    loop1 = setInterval(function () {
        "use strict";
        if (i > 100) {
            clearInterval(loop1);
            selector1.textContent = 4;
        } else {
            selector1.textContent = randomNum();
            i++;
        }
    }, time);
}

export function manageSub(){
    $(document).ready(function () {

    $('#TransactionDetailDiv').hide();
      $('#backbtn').hide();
      $('.transactionDiv').click(function () {
        $('#changetext').html('Bank Quotes');
        $('#transactionID').slideUp();
        $('#TransactionDetailDiv').slideDown();
        $('#backbtn').fadeIn();
      });

      $('#backbtn').click(function () {
        $('#changetext').html('Active Transactions');
        $('#TransactionDetailDiv').slideUp();
        $('#transactionID').slideDown();
        $('#TransactionDetailDiv').hide();
        $('#backbtn').fadeOut();
      });

      $('#menu-bar #tab2').hide();
      $('#menu-bar #tab3').hide();
      $('#menu-bar #btnpreview').click(function () {
        $('#menu-bar #tab1').slideUp();
        $('#menu-bar #tab2').slideDown();
      });

      $('#menu-bar #btnEdit').click(function () {
        $('#menu-bar #tab1').slideDown();
        $('#menu-bar #tab2').slideUp();
      });

      $('#menu-bar #btnSubmit').click(function () {
        $('#menu-bar #tab2').slideUp();
        $('#menu-bar #tab1').slideUp();
        $('#menu-bar #tab3').slideDown();
      });

      $('#menu-bar1 #tab3').hide();
      
      $('#menu-bar1 #btnSubmit').click(function () {
        $('#menu-bar1 #tab2').slideUp();
        $('#menu-bar1 #tab1').slideUp();
        $('#menu-bar1 #tab3').slideDown();
      });

      $('#paradiv').hide();
      $('#okbtn').hide();

    //   $('#btninvite').click(function () {
    //     $('#authemaildiv').slideUp();
    //     $('#paradiv').slideDown();
    //     $('#okbtn').show();
    //     $('#btninvite').hide();
    //   });

      $('#okbtn').click(function () {
        $('#authemaildiv').slideDown();
        $('#paradiv').slideUp();
        $('#okbtn').hide();
        $('#btninvite').show();
      });

      $('.popupcontent select').css('color', '#333');
      setTimeout(() => {
      $('#datatables').DataTable({
        "pagingType": "full_numbers", "scrollX": true,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        responsive: false, //scrollX: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records",
        }
      });

      $('#datatables1').DataTable({
        "pagingType": "full_numbers", "scrollX": true,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        responsive: false,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records",
        }
      });


      var table = $('#datatables').DataTable();

      // Edit record
      table.on('click', '.edit', function () {
        const $tr = $(this).closest('tr');
        var data = table.row($tr).data();
        alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      });

      // Delete a record
      table.on('click', '.remove', function (e) {
        const $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
        e.preventDefault();
      });

      //Like record
      table.on('click', '.like', function () {
        alert('You clicked on Like button');
      });
    },500);

      $('.card .material-datatables label').addClass('form-group');
    });

    $(function(){        
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

          var slider = $("#menu-bar1").slideReveal({
        // width: 100,
        push: false,
        position: "right",
        // speed: 600,
        trigger: $(".handle1"),
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
}

export function bankNewTransaction(){
    $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });
    
    $(function(){
  
        var slider1 = $("#menubarConfirmQuote").slideReveal({
        push: false,
        width: 510,
        position: "right",
        trigger: $(".handle"),
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
        
        
    $(function(){
  
        var slider1 = $("#menubarBankerQuote").slideReveal({
        push: false,
        width: 520,
        position: "right",
        trigger: $(".handle"),
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
    


        $(function(){
  
            var slider1 = $("#menubarDiscountQuote").slideReveal({
            push: false,
            width: 520,
            position: "right",
            trigger: $(".handle"),
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



            $(function(){
  
                var slider1 = $("#menubarConDisQuote").slideReveal({
                push: false,
                width: 520,
                position: "right",
                trigger: $(".handle"),
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



                $(function(){
  
                    var slider1 = $("#menubarRefinanceQuote").slideReveal({
                    push: false,
                    width: 520,
                    position: "right",
                    trigger: $(".handle"),
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

     
     
    $(function(){    
    var slider4 = $("#menubarDetail").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handleDetail"),
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
    

    $(function(){
    
    var slider4 = $("#menubarDetail1").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleDetail1"),
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
    
     
    $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarReopen").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleReopen"),
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
    
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
      $('#menu-bar #tab2').hide();
      $('#menu-bar #tab3').hide();
      $('#menu-bar #btnpreview').click(function(){
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab2').slideDown();
      });
    
      $('#menu-bar #btnEdit').click(function(){
          $('#menu-bar #tab1').slideDown();
           $('#menu-bar #tab2').slideUp();
      });
    
    
      $('#menu-bar #btnSubmit').click(function(){
          $('#menu-bar #tab2').slideUp();
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab3').slideDown();
      });


      $('#menubarConfirmQuote #tab2').hide();
      $('#menubarConfirmQuote #tab3').hide();
      $('#menubarConfirmQuote #btnpreview').click(function(){
          $('#menubarConfirmQuote #tab1').slideUp();
           $('#menubarConfirmQuote #tab2').slideDown();
      });
    
      $('#menubarConfirmQuote #btnEdit').click(function(){
          $('#menubarConfirmQuote #tab1').slideDown();
           $('#menubarConfirmQuote #tab2').slideUp();
      });
    
    
      $('#menubarConfirmQuote #btnSubmit').click(function(){
          $('#menubarConfirmQuote #tab2').slideUp();
          $('#menubarConfirmQuote #tab1').slideUp();
           $('#menubarConfirmQuote #tab3').slideDown();
      });


      $('#menubarDiscounting #tab2').hide();
      $('#menubarDiscounting #tab3').hide();
      $('#menubarDiscounting #btnpreview').click(function(){
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab2').slideDown();
      });
    
      $('#menubarDiscounting #btnEdit').click(function(){
          $('#menubarDiscounting #tab1').slideDown();
           $('#menubarDiscounting #tab2').slideUp();
      });

       $('#menubarDiscounting #btnSubmit').click(function(){
          $('#menubarDiscounting #tab2').slideUp();
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab3').slideDown();
      });

      $('#menubarConfDis #tab2').hide();
      $('#menubarConfDis #tab3').hide();
      $('#menubarConfDis #btnpreview').click(function(){
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab2').slideDown();
      });
    
      $('#menubarConfDis #btnEdit').click(function(){
          $('#menubarConfDis #tab1').slideDown();
           $('#menubarConfDis #tab2').slideUp();
      });

      $('#menubarConfDis #btnSubmit').click(function(){
          $('#menubarConfDis #tab2').slideUp();
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab3').slideDown();
      });

      $('#menubarRefinancing #tab2').hide();
       $('#menubarRefinancing #tab3').hide();
      $('#menubarRefinancing #btnpreview').click(function(){
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab2').slideDown();
      });
    
      $('#menubarRefinancing #btnEdit').click(function(){
          $('#menubarRefinancing #tab1').slideDown();
           $('#menubarRefinancing #tab2').slideUp();
      });


       $('#menubarRefinancing #btnSubmit').click(function(){
          $('#menubarRefinancing #tab2').slideUp();
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab3').slideDown();
      });
    
    
      $('#menubarBanker #tab2').hide();
      $('#menubarBanker #tab3').hide();
      $('#menubarBanker #btnpreview').click(function(){
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab2').slideDown();
      });
    
      $('#menubarBanker #btnEdit').click(function(){
          $('#menubarBanker #tab1').slideDown();
           $('#menubarBanker #tab2').slideUp();
      });

      $('#menubarBanker #btnSubmit').click(function(){
          $('#menubarBanker #tab2').slideUp();
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab3').slideDown();
      });
    
    
    
     
      $('#menubarReopen #tab2').hide();
      $('#menubarReopen #tab3').hide();
      $('#menubarReopen #btnpreview').click(function(){
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab2').slideDown();
      });

      $('#menubarReopen #btnSubmit').click(function(){ 
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab3').slideDown();
      });
    
      $('#menubarReopen #btnEdit').click(function(){
          $('#menubarReopen #tab1').slideDown(); 
      });
    
    });
    $(document).ready(function() {
       $('select').css('color', '#333');
      $('#datatables').DataTable({
        "pagingType": "full_numbers","scrollX": true,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        responsive: false,
        language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        }
    
      });
    
    
      var table = $('#datatables').DataTable();
    
      // Edit record
      table.on( 'click', '.edit', function () {
        $tr = $(this).closest('tr');
    
        var data = table.row($tr).data();
        alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
      } );
    
      // Delete a record
      table.on( 'click', '.remove', function (e) {
        $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
        e.preventDefault();
      } );
    
      //Like record
      table.on( 'click', '.like', function () {
        alert('You clicked on Like button');
      });
    
      $('.card .material-datatables label').addClass('form-group');
    });
    

    $(document).ready(function(){
    //  md.initSliders()
      demo.initFormExtendedDatetimepickers();
    });

}




export function bankActiveTransaction(){
    $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });
    
  //  setTimeout(() => {
    $(function(){
    // prettyPrint();
    
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
     $(function(){
  
    var slider1 = $("#menubarConfDis").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handle"),
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
    
     $(function(){
    var slider2 = $("#menubarDiscounting").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handle"),
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
    
     $(function(){    
    var slider3 = $("#menubarRefinancing").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handle"),
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
    
     
    $(function(){
    var slider4 = $("#menubarBanker").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handle"),
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
     
    
     
    $(function(){    
    var slider4 = $("#menubarDetail").slideReveal({
    push: false,
    position: "right",
    trigger: $(".handleDetail"),
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
    

    $(function(){
    
    var slider4 = $("#menubarDetail1").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleDetail1"),
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
    
     
    $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarReopen").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleReopen"),
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
    
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
    
    
      $('#menu-bar #tab2').hide();
      $('#menu-bar #tab3').hide();
      $('#menu-bar #btnpreview').click(function(){
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab2').slideDown();
      });
    
      $('#menu-bar #btnEdit').click(function(){
          $('#menu-bar #tab1').slideDown();
           $('#menu-bar #tab2').slideUp();
      });
    
    
      $('#menu-bar #btnSubmit').click(function(){
          $('#menu-bar #tab2').slideUp();
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab3').slideDown();
      });

      $('#menubarDiscounting #tab2').hide();
      $('#menubarDiscounting #tab3').hide();
      $('#menubarDiscounting #btnpreview').click(function(){
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab2').slideDown();
      });
    
      $('#menubarDiscounting #btnEdit').click(function(){
          $('#menubarDiscounting #tab1').slideDown();
           $('#menubarDiscounting #tab2').slideUp();
      });

       $('#menubarDiscounting #btnSubmit').click(function(){
          $('#menubarDiscounting #tab2').slideUp();
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab3').slideDown();
      });

      $('#menubarConfDis #tab2').hide();
      $('#menubarConfDis #tab3').hide();
      $('#menubarConfDis #btnpreview').click(function(){
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab2').slideDown();
      });
    
      $('#menubarConfDis #btnEdit').click(function(){
          $('#menubarConfDis #tab1').slideDown();
           $('#menubarConfDis #tab2').slideUp();
      });

      $('#menubarConfDis #btnSubmit').click(function(){
          $('#menubarConfDis #tab2').slideUp();
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab3').slideDown();
      });

      $('#menubarRefinancing #tab2').hide();
       $('#menubarRefinancing #tab3').hide();
      $('#menubarRefinancing #btnpreview').click(function(){
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab2').slideDown();
      });
    
      $('#menubarRefinancing #btnEdit').click(function(){
          $('#menubarRefinancing #tab1').slideDown();
           $('#menubarRefinancing #tab2').slideUp();
      });


       $('#menubarRefinancing #btnSubmit').click(function(){
          $('#menubarRefinancing #tab2').slideUp();
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab3').slideDown();
      });
    
    
      $('#menubarBanker #tab2').hide();
      $('#menubarBanker #tab3').hide();
      $('#menubarBanker #btnpreview').click(function(){
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab2').slideDown();
      });
    
      $('#menubarBanker #btnEdit').click(function(){
          $('#menubarBanker #tab1').slideDown();
           $('#menubarBanker #tab2').slideUp();
      });

      $('#menubarBanker #btnSubmit').click(function(){
          $('#menubarBanker #tab2').slideUp();
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab3').slideDown();
      });
    
    
    
     
      $('#menubarReopen #tab2').hide();
      $('#menubarReopen #tab3').hide();
      $('#menubarReopen #btnpreview').click(function(){
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab2').slideDown();
      });

      $('#menubarReopen #btnSubmit').click(function(){ 
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab3').slideDown();
      });
    
      $('#menubarReopen #btnEdit').click(function(){
          $('#menubarReopen #tab1').slideDown(); 
      });
    
    });
    $(document).ready(function() {
       $('select').css('color', '#333');
      $('#datatables').DataTable({
        "pagingType": "full_numbers","scrollX": true,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        responsive: false,
        language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        }
    
      });
    
    
      var table = $('#datatables').DataTable();
    
      // Edit record
      table.on( 'click', '.edit', function () {
        $tr = $(this).closest('tr');
    
        var data = table.row($tr).data();
        alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
      } );
    
      // Delete a record
      table.on( 'click', '.remove', function (e) {
        $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
        e.preventDefault();
      } );
    
      //Like record
      table.on( 'click', '.like', function () {
        alert('You clicked on Like button');
      });
    
      $('.card .material-datatables label').addClass('form-group');
    });
    

    $(document).ready(function(){
    //  md.initSliders()
      demo.initFormExtendedDatetimepickers();
    });

//}, 1000);
}

export function loadLogin() {
    $('#signUp').click(function () {
        $('#container').addClass('right-panel-active');
    });

    $('#signIn').click(function () {
        $('#container').removeClass('right-panel-active');
        $('#logindiv').slideDown();
    });

    $('#btnForgot').click(function () {
        $('#logindiv').slideUp();
        $('#ForgotPassworddiv').slideDown();
    });

    $('#btnLogin').click(function () {
        $('#ForgotPassworddiv').slideUp();
        $('#logindiv').slideDown();
    });

    $(function () {
        // $(".inputDiv input, .inputDiv select").on('focus blur', function () {
        //     $(this).parent().toggleClass('is-focused');
        // });
        // $(".inputDiv input, .inputDiv select").on('focus blur', function () {
        //     $(this).toggleClass('ng-invalid');
        // });
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
        $('.selection').hide();
        $('.referrerdiv').hide();
        $('.bankfields').hide();
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

        var radioValue = $("input[name='radio']:checked").val();
        if (radioValue == "bank") {
            $('.selection').slideDown();
            $('.bankfields').slideDown();
        } else {
            $('.selection').slideUp();
            $('.bankfields').slideUp();
        }
        if (radioValue == "referrer") {
            $('.referrerdiv').slideDown();
        } else {
            $('.referrerdiv').slideUp();
        }
        $(".radio-tile-group input[name='radio']").click(function () {
            // debugger;
            var radioValue = $("input[name='radio']:checked").val();
            if (radioValue == "bank") {
                $('.selection').slideDown();
                $('.bankfields').slideDown();
                $('.rc-anchor-normal').css('margin', '5px auto 5px');
                $('.loginbody a').css('margin', '5px 0 0');
            } else {
                $('.selection').slideUp();
                $('.bankfields').slideUp();
            }
            if (radioValue == "referrer") {
                $('.referrerdiv').slideDown();
            } else {
                $('.referrerdiv').slideUp();
            }
        });
    });

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $('.textddlV').hide();
    $('.countryddl').change(function () {
        $('.textddlV').show();
        var textddl = ($(this).val());
        if (textddl == "India") {

            $('.textddlV').attr('data-original-title', '32 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }

        else if (textddl == "Bangladesh") {
            $('.textddlV').attr('data-original-title', '28 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }

        else if (textddl == "Kenya") {
            $('.textddlV').attr('data-original-title', '52 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }

        else if (textddl == "Nigeria") {
            $('.textddlV').attr('data-original-title', '54 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }

        else if (textddl == "UAE") {
            $('.textddlV').attr('data-original-title', '44 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }

        else if (textddl == "Qatar") {
            $('.textddlV').attr('data-original-title', '12 Banks are listed in this country to fund LCs');
            $("[data-toggle='tooltip']").tooltip('show');
        }
        else {
            $('.textddlV').hide();
        }
    });
}

export function bankRequest(){

        $('.collapse').on('shown.bs.collapse', function(){
            $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
            }).on('hidden.bs.collapse', function(){
            $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
            });
            setTimeout(() => {
            $(function(){
                // prettyPrint();
                
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
                 $(function(){
                // prettyPrint();
                
                var slider1 = $("#menubarConfDis").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleConfDis"),
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
                
                 $(function(){
                // prettyPrint();
                
                var slider2 = $("#menubarDiscounting").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleDis"),
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
                
                 $(function(){
                // prettyPrint();
                
                var slider3 = $("#menubarRefinancing").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleRef"),
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
                
                 
                $(function(){
                // prettyPrint();
                
                var slider4 = $("#menubarBanker").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleBan"),
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
                 
                
                 
                $(function(){
                // prettyPrint();
                
                var slider5 = $("#menubarDetail").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleDetail"),
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
       
                 $(function(){
                // prettyPrint();
                
                var slider6 = $("#menubarDetail1").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleDetail1"),
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
                
                
                 
                $(function(){
                // prettyPrint();
                
                var slider7 = $("#menubarReopen").slideReveal({
                // width: 100,
                push: false,
                position: "right",
                // speed: 600,
                trigger: $(".handleReopen"),
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
         
                $(document).ready(function(){
                    $('[data-toggle="tooltip"]').tooltip();   
                  
                  
                    $('#menu-bar #tab2').hide();
                    $('#menu-bar #tab3').hide();
                    $('#menu-bar #btnpreview').click(function(){
                        $('#menu-bar #tab1').slideUp();
                         $('#menu-bar #tab2').slideDown();
                    });
                  
                    $('#menu-bar #btnEdit').click(function(){
                        $('#menu-bar #tab1').slideDown();
                         $('#menu-bar #tab2').slideUp();
                    });
                  
                  
                    $('#menu-bar #btnSubmit').click(function(){
                        $('#menu-bar #tab2').slideUp();
                        $('#menu-bar #tab1').slideUp();
                         $('#menu-bar #tab3').slideDown();
                    });
                  
                    $('#menubarDiscounting #tab2').hide();
                    $('#menubarDiscounting #tab3').hide();
                    $('#menubarDiscounting #btnpreview').click(function(){
                        $('#menubarDiscounting #tab1').slideUp();
                         $('#menubarDiscounting #tab2').slideDown();
                    });
                  
                    $('#menubarDiscounting #btnEdit').click(function(){
                        $('#menubarDiscounting #tab1').slideDown();
                         $('#menubarDiscounting #tab2').slideUp();
                    });
         
                     $('#menubarDiscounting #btnSubmit').click(function(){
                        $('#menubarDiscounting #tab2').slideUp();
                        $('#menubarDiscounting #tab1').slideUp();
                         $('#menubarDiscounting #tab3').slideDown();
                    });
                  
                    $('#menubarConfDis #tab2').hide();
                    $('#menubarConfDis #tab3').hide();
                    $('#menubarConfDis #btnpreview').click(function(){
                        $('#menubarConfDis #tab1').slideUp();
                         $('#menubarConfDis #tab2').slideDown();
                    });
                  
                    $('#menubarConfDis #btnEdit').click(function(){
                        $('#menubarConfDis #tab1').slideDown();
                         $('#menubarConfDis #tab2').slideUp();
                    });
         
                    $('#menubarConfDis #btnSubmit').click(function(){
                        $('#menubarConfDis #tab2').slideUp();
                        $('#menubarConfDis #tab1').slideUp();
                         $('#menubarConfDis #tab3').slideDown();
                    });
         
         
         
         
                  
                  
                    $('#menubarRefinancing #tab2').hide();
                     $('#menubarRefinancing #tab3').hide();
                    $('#menubarRefinancing #btnpreview').click(function(){
                        $('#menubarRefinancing #tab1').slideUp();
                         $('#menubarRefinancing #tab2').slideDown();
                    });
                  
                    $('#menubarRefinancing #btnEdit').click(function(){
                        $('#menubarRefinancing #tab1').slideDown();
                         $('#menubarRefinancing #tab2').slideUp();
                    });
         
         
                     $('#menubarRefinancing #btnSubmit').click(function(){
                        $('#menubarRefinancing #tab2').slideUp();
                        $('#menubarRefinancing #tab1').slideUp();
                         $('#menubarRefinancing #tab3').slideDown();
                    });
                  
                  
                    $('#menubarBanker #tab2').hide();
                    $('#menubarBanker #tab3').hide();
                    $('#menubarBanker #btnpreview').click(function(){
                        $('#menubarBanker #tab1').slideUp();
                         $('#menubarBanker #tab2').slideDown();
                    });
                  
                    $('#menubarBanker #btnEdit').click(function(){
                        $('#menubarBanker #tab1').slideDown();
                         $('#menubarBanker #tab2').slideUp();
                    });
         
                    $('#menubarBanker #btnSubmit').click(function(){
                        $('#menubarBanker #tab2').slideUp();
                        $('#menubarBanker #tab1').slideUp();
                         $('#menubarBanker #tab3').slideDown();
                    });
                  
                  
                  
                   
                    $('#menubarReopen #tab2').hide();
                    $('#menubarReopen #tab3').hide();
                    $('#menubarReopen #btnpreview').click(function(){
                        $('#menubarReopen #tab1').slideUp();
                         $('#menubarReopen #tab2').slideDown();
                    });
         
                    $('#menubarReopen #btnSubmit').click(function(){ 
                        $('#menubarReopen #tab1').slideUp();
                         $('#menubarReopen #tab3').slideDown();
                    });
                  
                    $('#menubarReopen #btnEdit').click(function(){
                        $('#menubarReopen #tab1').slideDown(); 
                    });
                  
                  });
                  $('select').css('color', '#333');
                  setTimeout(() => {
                  $('#datatables').DataTable({
                    "pagingType": "full_numbers", "scrollX": true,
                    "lengthMenu": [[5 ,10, 25, 50, -1], [5 ,10, 25, 50, "All"]],
                  //  responsive: true,
                    language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records",
                    }
                
                  });
                
                
                  var table = $('#datatables').DataTable();
                
                  // Edit record
                  table.on( 'click', '.edit', function () {
                    $tr = $(this).closest('tr');
                
                    var data = table.row($tr).data();
                    alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
                  } );
                
                  // Delete a record
                  table.on( 'click', '.remove', function (e) {
                    $tr = $(this).closest('tr');
                    table.row($tr).remove().draw();
                    e.preventDefault();
                  } );
                
                  //Like record
                  table.on( 'click', '.like', function () {
                    alert('You clicked on Like button');
                  });
                  },500);
                  $('.card .material-datatables label').addClass('form-group');
                  demo.initFormExtendedDatetimepickers();

            //       $('#menu-barnew #tab2').hide();
            //    $('#menu-barnew #tab3').hide();
            //    $('#menu-barnew #btnpreview').click(function(){
            //        $('#menu-barnew #tab1').slideUp();
            //         $('#menu-barnew #tab2').slideDown();
            //    });
             
            //    $('#menu-barnew #btnEdit').click(function(){
            //        $('#menu-barnew #tab1').slideDown();
            //         $('#menu-barnew #tab2').slideUp();
            //    });
             
             
            //    $('#menu-barnew #btnSubmit').click(function(){
            //        $('#menu-barnew #tab2').slideUp();
            //        $('#menu-barnew #tab1').slideUp();
            //         $('#menu-barnew #tab3').slideDown();
            //    }); 
            }, 500);
}

export function custTrnsactionDetail() {
    
    $('#datatables select').css('color', '#333');
      
    $('#datatables').DataTable().destroy();
        setTimeout(() => {
            
        $('#datatables').DataTable({
            "pagingType": "full_numbers", "scrollX": true,
            "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            responsive: false, //scrollX: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            }
        });    
        // $('#addOptions').appendTo(".card-content");
        // $("#addOptions select").attr("(change)","changeStatusCall($event.target.value)");

        //$(".dataTables_filter label").addClass("pull-right");

        // $(".dataTables_filter .inputDiv").css({"display": "inline-block","position": "relative", "width": "200px","margin-bottom": "20px","margin": "0 25px 0 0px"});
    }, 500);
        
    // });
}

export function custActiveTransaction() {
    $('.popupcontent select').css('color', '#333');
    $('.card .material-datatables label').addClass('form-group');        
}


export function newRequest(){

     $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });
    setTimeout(() => {
    $(function(){
    // prettyPrint();
    
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
     $(function(){
    // prettyPrint();
    
    var slider1 = $("#menubarConfDis").slideReveal({
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
    
     $(function(){
    // prettyPrint();
    
    var slider2 = $("#menubarDiscounting").slideReveal({
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
    
     $(function(){
    // prettyPrint();
    
    var slider3 = $("#menubarRefinancing").slideReveal({
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
    
     
    $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarBanker").slideReveal({
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
     
    
     
    $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarDetail").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleDetail"),
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

     $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarDetail1").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleDetail1"),
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
    
    
     
    $(function(){
    // prettyPrint();
    
    var slider4 = $("#menubarReopen").slideReveal({
    // width: 100,
    push: false,
    position: "right",
    // speed: 600,
    trigger: $(".handleReopen"),
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
    
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
    
    
      $('#menu-bar #tab2').hide();
      $('#menu-bar #tab3').hide();
      $('#menu-bar #btnpreview').click(function(){
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab2').slideDown();
      });
    
      $('#menu-bar #btnEdit').click(function(){
          $('#menu-bar #tab1').slideDown();
           $('#menu-bar #tab2').slideUp();
      });
    
    
      $('#menu-bar #btnSubmit').click(function(){
          $('#menu-bar #tab2').slideUp();
          $('#menu-bar #tab1').slideUp();
           $('#menu-bar #tab3').slideDown();
      });



    
    
      $('#menubarDiscounting #tab2').hide();
      $('#menubarDiscounting #tab3').hide();
      $('#menubarDiscounting #btnpreview').click(function(){
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab2').slideDown();
      });
    
      $('#menubarDiscounting #btnEdit').click(function(){
          $('#menubarDiscounting #tab1').slideDown();
           $('#menubarDiscounting #tab2').slideUp();
      });

       $('#menubarDiscounting #btnSubmit').click(function(){
          $('#menubarDiscounting #tab2').slideUp();
          $('#menubarDiscounting #tab1').slideUp();
           $('#menubarDiscounting #tab3').slideDown();
      });





    
    
      $('#menubarConfDis #tab2').hide();
      $('#menubarConfDis #tab3').hide();
      $('#menubarConfDis #btnpreview').click(function(){
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab2').slideDown();
      });
    
      $('#menubarConfDis #btnEdit').click(function(){
          $('#menubarConfDis #tab1').slideDown();
           $('#menubarConfDis #tab2').slideUp();
      });

      $('#menubarConfDis #btnSubmit').click(function(){
          $('#menubarConfDis #tab2').slideUp();
          $('#menubarConfDis #tab1').slideUp();
           $('#menubarConfDis #tab3').slideDown();
      });




    
    
      $('#menubarRefinancing #tab2').hide();
       $('#menubarRefinancing #tab3').hide();
      $('#menubarRefinancing #btnpreview').click(function(){
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab2').slideDown();
      });
    
      $('#menubarRefinancing #btnEdit').click(function(){
          $('#menubarRefinancing #tab1').slideDown();
           $('#menubarRefinancing #tab2').slideUp();
      });


       $('#menubarRefinancing #btnSubmit').click(function(){
          $('#menubarRefinancing #tab2').slideUp();
          $('#menubarRefinancing #tab1').slideUp();
           $('#menubarRefinancing #tab3').slideDown();
      });
    
    
      $('#menubarBanker #tab2').hide();
      $('#menubarBanker #tab3').hide();
      $('#menubarBanker #btnpreview').click(function(){
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab2').slideDown();
      });
    
      $('#menubarBanker #btnEdit').click(function(){
          $('#menubarBanker #tab1').slideDown();
           $('#menubarBanker #tab2').slideUp();
      });

      $('#menubarBanker #btnSubmit').click(function(){
          $('#menubarBanker #tab2').slideUp();
          $('#menubarBanker #tab1').slideUp();
           $('#menubarBanker #tab3').slideDown();
      });
    
    
    
     
      $('#menubarReopen #tab2').hide();
      $('#menubarReopen #tab3').hide();
      $('#menubarReopen #btnpreview').click(function(){
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab2').slideDown();
      });

      $('#menubarReopen #btnSubmit').click(function(){ 
          $('#menubarReopen #tab1').slideUp();
           $('#menubarReopen #tab3').slideDown();
      });
    
      $('#menubarReopen #btnEdit').click(function(){
          $('#menubarReopen #tab1').slideDown(); 
      });
    
    });
    $(document).ready(function() {
       $('select').css('color', '#333');
      $('#datatables').DataTable({
        "pagingType": "full_numbers", "scrollX": true,
        "lengthMenu": [[5 ,10, 25, 50, -1], [5 ,10, 25, 50, "All"]],
      //  responsive: true,
        language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
        }
    
      });
    
    
      var table = $('#datatables').DataTable();
    
      // Edit record
      table.on( 'click', '.edit', function () {
        $tr = $(this).closest('tr');
    
        var data = table.row($tr).data();
        alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
      } );
    
      // Delete a record
      table.on( 'click', '.remove', function (e) {
        $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
        e.preventDefault();
      } );
    
      //Like record
      table.on( 'click', '.like', function () {
        alert('You clicked on Like button');
      });
    
      $('.card .material-datatables label').addClass('form-group');
    });
    
    $(document).ready(function(){
    //  md.initSliders()
      demo.initFormExtendedDatetimepickers();
    });
}, 500);   
}

export function creditTransaction(){
    $(document).ready(function() {
        demo.initFormExtendedDatetimepickers(); 

        $('#datatables').DataTable({
            "pagingType": "full_numbers","scrollX": true,
            "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
            responsive: false, //scrollX: true,
            language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records",
            }
        
          });

          var table = $('#datatables').DataTable();
         
           // Edit record
           table.on( 'click', '.edit', function () {
             $tr = $(this).closest('tr');
         
             var data = table.row($tr).data();
             alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
           } );
         
           // Delete a record
           table.on( 'click', '.remove', function (e) {
             $tr = $(this).closest('tr');
             table.row($tr).remove().draw();
             e.preventDefault();
           } );
         
           //Like record
           table.on( 'click', '.like', function () {
             alert('You clicked on Like button');
           });
         
           $('.card .material-datatables label').addClass('form-group');
        });

        $(".datepicker").on("dp.show", function(e) {
            debugger;
            // alert('test');
            $('.datepicker + div + label').addClass('calendarlabel');
            $('.inputDiv input, .inputDiv textarea').focusout(function() {
                var text_val = $(this).val();
                if (text_val === "") {
                    $(this).removeClass('has-value');
                    $('.datepicker + div + label').removeClass('calendarlabel');
                } else {
                    $(this).addClass('has-value');
                    $('.datepicker + div + label').addClass('calendarlabel');
                }
            });
        });
}

export function newLCUpload(){

    $(document).ready(function() { 
      
        demo.initFormExtendedDatetimepickers(); 
              
       //code for tooltip text changes as per country selection
        $('.textddlV').hide();      
        $('.countryddl').change(function() {
       $('.textddlV').show();
        var textddl = ($(this).val());
            if (textddl == "India") { 
       
              $('.textddlV').attr('data-original-title','32 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
       
            else if (textddl == "Bangladesh") { 
              $('.textddlV').attr('data-original-title','28 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
       
            else if (textddl == "Kenya") { 
              $('.textddlV').attr('data-original-title','52 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
       
            else if (textddl == "Nigeria") { 
              $('.textddlV').attr('data-original-title','54 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
       
            else if (textddl == "UAE") { 
              $('.textddlV').attr('data-original-title','44 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
       
            else if (textddl == "Qatar") { 
              $('.textddlV').attr('data-original-title','12 Banks are listed in this country to fund LCs');
               $("[data-toggle='tooltip']").tooltip('show'); 
            }  
            else{
             $('.textddlV').hide();
            }
        });
       
              
       //code for hide show according to applicant and beneficiary selection 
            $('#divBene').hide();
            $("input[name='userType']").click(function () {
                
                var radioValue = $("input[name='userType']:checked").val();
                if (radioValue == "Beneficiary") {
                $('#divApplicant').hide();
                $('#divBene').show();
                }
                else if (radioValue == "Applicant") {
                $('#divApplicant').show();
                $('#divBene').hide();
                }
            });
        //   $("#filestyle-0").filestyle('placeholder', 'Upload Document (only pdf, jpeg, png)');
          //  md.initSliders()
            demo.initFormExtendedDatetimepickers();
             $("[data-toggle='tooltip']").tooltip(); 
             $('.all, .alltenor').hide();
             $('.ChkConfirmation, .chkconfirmTenor').show();

             
        //code for Requirement textbox selection  
        $(".radio-tile-group input[name='selector']").click(function() {
             debugger;
             var radioValue = $("input[name='selector']:checked").val();
             if (radioValue == "Confirmation") {
                 $('.all, .alltenor').hide();
                 $('.ChkConfirmation, .chkconfirmTenor').show();
             }
             else if(radioValue == "Discounting"){
               $('.all, .alltenor').hide();
                 $('.discounting, .chkDiscountTenor').show();
             }
             else if(radioValue == "ConfirmAndDiscount"){
               $('.all, .alltenor').hide();
                 $('.confDiscounting, .chkConfDiscTenor').show();
             }
             else if(radioValue == "Refinance"){
               $('.all, .alltenor').hide();
                 $('.Refinancing, .chkRefinaceTenor').show();
             }
             else if(radioValue == "Banker"){
               $('.all, .alltenor').hide();
                 $('.Bankers, .chkBankerTenor').show();
             }
         });

         $("input[name='optionsRadios']").click(function() {
            var radioValue1 = $("input[name='optionsRadios']:checked").val();
            if (radioValue1 == "rdmaturity") {
                 $('.multipledate').hide();
            } else {
                $('.multipledate').show();
            } 
          });

    });
}