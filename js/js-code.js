$(document).ready(function () {
    if (localStorage.getItem("studentsArray") === null) {
        var studentsArray = [];
        localStorage.setItem('studentsArray', JSON.stringify(studentsArray));
    }
    var studentsArray = JSON.parse(localStorage.getItem("studentsArray"));
    var studentForm = $('form[name="studentFrom"]');
    var allSelectsForm = studentForm.find('select');

    getCountries(allSelectsForm.eq(0));

    allSelectsForm.first().on("change", function () {
        getStatesByCountry(allSelectsForm.eq(1), allSelectsForm.eq(0).val());
    });

    allSelectsForm.eq(1).on("change", function () {
        getCitiesByState(allSelectsForm.eq(2), allSelectsForm.eq(1).val())
    });

    displayStudentData();
});

const API_BASE_URL = 'https://www.universal-tutorial.com';
const API_HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ1ZHNhdmFsaXlhMDNAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiQU9wbXhvWGxpVlBqWTdaZXpKTzFkejYwZlpGQlJFLU1pQ2ZWV1IzYnNzZlI4WU9MVTIzQ2d4VUdiVFliaDJ3OCJ9LCJleHAiOjE2MjM2NTU3MTV9.fc90vyL9fxloyMuKUNGEAXmjBaYT9OH8ioPN4ZAe-7s"
};

function getCountries(element, country=undefined, state=undefined, city=undefined) {
    $.ajax({
        url: `${API_BASE_URL}/api/countries`,
        headers: API_HEADERS,
        success: function (response) {
            $.each(response, function (key, region) {
                element.append(`<option value="${region['country_name']}">${region['country_name']}</option>`);
            });
            if (country) {
                element.val(country);
                getStatesByCountry($($('select').get(1)), country, state, city)
            }
        }
    });
}

function getStatesByCountry(element, country, state=undefined, city=undefined) {
    $.ajax({
        url: `${API_BASE_URL}/api/states/${country}`,
        headers: API_HEADERS,
        beforeSend: function(){
            element.parent().siblings().last().find('i').toggle();
        },
        success: function (response) {
            $('form select').not(':eq(0)').find(":gt(0)").remove();
            $.each(response, function (key, region) {
                element.append(`<option value="${region['state_name']}">${region['state_name']}</option>`);
            });
            if (state) {
                element.val(state);
                getCitiesByState($($('select').get(2)), state, city)
            }
            element.parent().siblings().last().find('i').toggle();
        }
    });
}

function getCitiesByState(element, state, city=undefined) {
    $.ajax({
        url: `${API_BASE_URL}/api/cities/${state}`,
        headers: API_HEADERS,
        beforeSend: function(){
            $(".cityLoader").toggle();
        },
        success: function (response) {
            element.find(":gt(0)").remove();
            $.each(response, function (key, region) {
                element.append(`<option value="${region['city_name']}">${region['city_name']}</option>`);
            });
            if (city) {
                element.val(city);
            }
            $(".cityLoader").toggle();
        }
    });
}


// disply method for data print studentDatasArray into table.
function displayStudentData(ShortAndSearch = null) {
    var appData = '';
    $.each(ShortAndSearch == null ? studentsArray : ShortAndSearch, function (key, student) {
        appData += '<tr><td>' + student.student_name + '</td>';
        appData += '<td>' + student.email + '</td>';
        appData += '<td>' + student.gender + '</td>';
        appData += '<td>' + student['hobbies[]'] + '</td>';
        appData += '<td>' + student.country + '</td>';
        appData += '<td>' + student.state + '</td>';
        appData += '<td>' + student.city + '</td>';
        appData += '<td><i class="fas fa-user-edit mr-2" tooltip="Update student" onclick="javascript:updateStudentData(' + student.student_id + ');"></i> <i class="fas fa-trash" tooltip="Delete student" onclick="javascript:deleteStudentData(' +
            student.student_id + ');"></i></td></tr>';
    });
    $("table tbody").html(appData);
}


// Save button click then save and update data studentDatas array and disply in table.
$('form[name="studentFrom"]').on('submit', function (e) {
    e.preventDefault()
    if (formValidation(this)) {
        studentFromData = $(this).serializeObject();
        student_id = studentFromData.student_id;
        arrayLength = studentsArray.length;

        if (student_id == undefined || student_id == '') {
            studentFromData.student_id = arrayLength == 0 ? 1 : studentsArray[arrayLength - 1]['student_id'] + 1;
            studentsArray.push(studentFromData);
        } else {
            student_index = studentsArray.findIndex(student => student.student_id == Number(student_id));
            if (student_index !== undefined) {
                studentFromData.student_id = Number(student_id);
                studentsArray[student_index] = studentFromData;
            }
        }
        localStorage.setItem('studentsArray', JSON.stringify(studentsArray));
        $(this).find("input[type=reset]").trigger('click');
        $('input[type="search"]').val('');
        displayStudentData();
    }
});


function removeResetButton(btnReset) {
    $(btnReset).hide('slow');
    $(btnReset).siblings().val('Save').removeClass('btn-warning', 1000).addClass('btn-primary btn-block', 1000);
    $('form select').not(':eq(0)').find(":gt(0)").remove();
}


// Update funcation to update data in studentArray.
function updateStudentData(student_id) {
    var student = studentsArray.find(function (studentArray) {
        return studentArray.student_id == student_id
    });
    var studentForm = $('form[name="studentFrom"]');
    studentForm.find("input[name=student_name]").val(student.student_name).focus();
    studentForm.find("input[type=email]").val(student.email);
    studentForm.find('input:radio[name=gender]').filter('[value=' + student.gender + ']').prop('checked', true);
    studentForm.find('input[name="hobbies[]"]').val(student['hobbies[]']);
    getCountries(studentForm.find('select').first(), student.country, student.state, student.city);
    studentForm.find("input[name=student_id]").val(student_id);
    studentForm.find("input[type=submit]").val('Update').removeClass('btn-secondary btn-block').addClass('float-right btn-warning');
    studentForm.find("input[type=reset]").show('slow');
}


// Delete funcation to remove data in studentArray.
function deleteStudentData(del_student_id) {
    const index = studentsArray.findIndex(student => student.student_id === del_student_id);
    bootbox.confirm({
        title: "Are you sure remove?",
        message: "Remove student <b>" + studentsArray[index]['student_name'] + "</b> record!",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> No Way!',
                className: 'btn-info'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Yes! Delete',
                className: 'btn-warning'
            }
        },
        callback: function (result) {
            if (result) {
                studentsArray.splice(index, 1);
                localStorage.setItem('studentsArray', JSON.stringify(studentsArray));
                $('form[name="studentFrom"]').find("input[type=reset]").trigger('click');
                displayStudentData();
            }
        }
    });
}


// srarch student name on keyup display table.
$('input[type="search"]').bind("change keyup input", function (e) {
    e.preventDefault();
    var searchValue = $(this).val().trim();
    var searchStudentNameArray = searchValue != '' ? studentsArray.filter(student => student.student_name.toLowerCase().startsWith(searchValue.toLowerCase())) : studentsArray;
    displayStudentData(searchStudentNameArray);
});


// short by student name asc, desc and dafault by student_id
$('select[name="shortByName"]').on("change", function () {
    var short = $(this).val();
    studentsArray.sort(function (x, y) {
        let a = x.student_name.toUpperCase(),
            b = y.student_name.toUpperCase();
        return short == '' ? x.student_id - y.student_id : short == 'asc' ? a < b ? -1 : 1 : a > b ? -1 : 1;
    });
    displayStudentData(studentsArray);
});
