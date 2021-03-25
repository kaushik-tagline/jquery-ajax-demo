if (localStorage.getItem("studentsArray") === null) {
    var studentsArray = [];
    localStorage.setItem('studentsArray', JSON.stringify(studentsArray));
}
var studentsArray = JSON.parse(localStorage.getItem("studentsArray"));