let closeCourses;
let localObj = {latitude: 40.4426135, longitude: -111.8631115, radius: 20};
let dropDown = $('#dropdown-courses');
let currentId;
let currentCourse;
let buttonRow = $('.card-buttons');
let currentTee;
let teeAdded = false;
let scoreTable = $('#score-table');
let welcomeCard = $('#welcome-card');
let modalButton = $('#modal-button');
let inputRadius = $('#radius-input');
let modalGoButton = $('#modal-go-bttn');


function loadMe(){
    scoreTable.hide();
    $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    });
    modalButton.click();
}

modalGoButton.on('click', () => {
    localObj.radius = (inputRadius.val()) ? inputRadius.val() : 20;
    let coordinates = $('#coordinate-input').val().split(" ");
    if(coordinates.length > 1){
        localObj.latitude = Number(coordinates[0]);
        localObj.longitude = Number(coordinates[1]);
    }
    // localObj.latitude = (isNaN(coordinates[0])) ? 40.4426135 : coordinates[0];
    // localObj.longitude = (isNaN(coordinates[1])) ? -111.8631115 : coordinates[1];
    debugger;
    getCourses();
});

function getCourses(){
    $.post("https://golf-courses-api.herokuapp.com/courses", localObj, data => {
        closeCourses = JSON.parse(data);
        for(let p in closeCourses.courses){
            dropDown.append(`<a href="#" class="dropdown-item courses-id-class" data-course-id=${closeCourses.courses[p].id}> ${closeCourses.courses[p].name} </a>`)
        }
        $('.courses-id-class').on('click', function(e){
            currentId = $(this).attr('data-course-id');
            console.log(currentId);
             getCourse(currentId);
        });
    });

    $('#go').on('click', function(){
        loadScoreCard();
    });
}

function getCourse(courseId){
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseId, (data) => {
        currentCourse = JSON.parse(data);
        console.log(currentCourse);

        addCardDetails();
        addTees();
    })
}

function addCardDetails(){

    cardImage.attr('src', currentCourse.course.thumbnail);

    if(currentCourse.course.description){
        $('#welcome-card-description').text(currentCourse.course.description);
    }
    else{
        $('#welcome-card-description').text(descriptionText);
    }

    $('#welcome-card-title').text(currentCourse.course.name);
}

function addTees(){
    let dropDownTees;


    if(!teeAdded){
        buttonRow.append(dropdownButton);
        dropDownTees = $('#dropdown-tees');
        teeAdded = !teeAdded;
    }
    else{
        dropDownTees = $('#dropdown-tees');
        dropDownTees.empty();
    }


    dropDownTees.append('<a href="#" class="dropdown-item courses-tee-class"> Loading... </a>');

    window.setTimeout(() => {
        dropDownTees.empty();
        for(let te in currentCourse.course.tee_types){
            if(currentCourse.course.tee_types[te].tee_type !== ""){
                dropDownTees.append(`<a href="#" class="dropdown-item courses-tee-class" >${currentCourse.course.tee_types[te].tee_type}</a>`);
            }
        }

        if(dropDownTees.children().length < 1){
            dropDownTees.append('<a href="#" class=dropdown-item > No tee types found </a>');
        }

        $(dropDownTees).on('click', 'a', function (){
           currentTee = $(this).text();
           dropDownTees.prev().text(currentTee);
        });
    }, 2000);
}

function loadScoreCard(){
    welcomeCard.hide();
    scoreTable.show();
    let nameHeader = $('#course-name-header');
    let teeHeader = $('#course-tee-type-header');
    nameHeader.text(currentCourse.course.name);
    teeHeader.text(currentTee);
}