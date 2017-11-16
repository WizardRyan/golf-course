let closeCourses;
let localObj = {latitude: 40.4426135, longitude: -111.8631115, radius: 20};
let dropDown = $('#dropdown-courses');

function loadMe(){
    $.post("https://golf-courses-api.herokuapp.com/courses", localObj, data => {
        closeCourses = JSON.parse(data);
        for(let p in closeCourses.courses){
            dropDown.append(`<a href="#"> ${closeCourses.courses[p].name} </a>`)
        }
    });
}

function getCourse(courseId){
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseId, (data) => {
        currentCourse = JSON.parse(data);
        console.log(currentCourse);
    })
}