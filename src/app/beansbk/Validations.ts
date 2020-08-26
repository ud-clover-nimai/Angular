import { FormGroup } from '@angular/forms';


export class ValidateRegex {

    static validateNumber(evt): any { //// on keypress
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            evt.preventDefault();
        }
        return true;
    }

    static alphaOnly(event): any { //// on keydown
        var key = event.keyCode;
        if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key > 31 && (key < 48 || key > 57))) {
            event.preventDefault();
        }
    };

    static alphaNspace(event): any { //// on keydown
        var key = event.keyCode;
        if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/) || key==32/*SPACE*/) {
            event.preventDefault();
        }
    };

    static alphaNumeric(e): any { //// on keypress
        var k;
        document.all ? k = e.keyCode : k = e.which;
        if (!((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57))) {
            event.preventDefault();
        }
    }

    static numWithDecimal(evt): any { //// on keypress
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            evt.preventDefault();
        return true;
    }
    static validateEmail(email) {
        var val = email.value;
        var reg1 = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    
        if (reg1.test(email) == false) {
            alert("invalid mail")
        }else if (reg1.test(email) == true) {
            alert("ekdam corrrect mail")
        }
      };
}

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
