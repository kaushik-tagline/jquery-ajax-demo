// form validation method and define rule of validation.
function formValidation(formObj) {
    var valid = true;
    var form  = $(formObj);
    var formAllSelects = form.find('select');
    var formData = form.serializeObject();
    form.find(".border-danger").removeClass("border-danger");
    form.find(".error-msg").remove();

    if (formData.student_name == '' || formData.student_name.length < 3) {
        valid = false;
        form.find("input[name=student_name]").addClass("border-danger").after('<span class="error-msg text-danger">Student name is required with minmum 3 character.</span>');
    }

    var email = formData.email;
    var emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (emailPattern.test(email) == false) {
        valid = false;
        form.find("input[name=email]").addClass("border-danger").after('<span class="error-msg text-danger">Email is required with proper email.</span>');
    }

    var hobbies = formData["hobbies[]"];
    if(hobbies.length < 2 || !Array.isArray(hobbies)) {
        valid = false;
        form.find('input[name="hobbies[]"]').parents(':eq(1)').append('<br><span class="error-msg text-danger">Select minimum 2 hobbies.</span>');
    }

    if (formData.country == undefined || formData.country == '') {
        valid = false;
        formAllSelects.eq(0).addClass("border-danger").after('<span class="error-msg text-danger">Select any one country.</span>');
    } 
    if (formData.state == undefined || formData.state == '') {
        valid = false;
        formAllSelects.eq(1).addClass("border-danger").after('<span class="error-msg text-danger">Select any one state.</span>');
    }

    if (formData.city == undefined || formData.city == '') {
        valid = false;
        formAllSelects.eq(2).addClass("border-danger").after('<span class="error-msg text-danger">Select any one city.</span>');
    } 
    return valid;
}
