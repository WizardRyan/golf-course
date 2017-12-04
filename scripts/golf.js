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
let tableHeadRow = $('#score-table-head-row');
let playerDropdown = $('#player-number-dropdown');
let numOfPlayers = 1;
let tableBody = $('#table-body');
let selectTeeDiv = $('#select-tee');
let numHoles = 0;
let teeHeader = $('#course-tee-type-header');
let mainHeader = $('#main-header-id');
let scoreModalButton = $('#score-modal-button');
let gTotalScore = [];
let gPar = 0;
let parRow = $('#par');

function loadMe(){
    scoreTable.hide();
    selectTeeDiv.hide();
    mainHeader.hide();
    scoreModalButton.hide();

    $('#exampleModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    });


    modalButton.click();

   playerDropdown.children().on('click', function(){
       numOfPlayers = Number($(this).text());
       $(this).parent().prev().text('Number of Players: ' + numOfPlayers);
   });

   $('button').on('click', function(e){
       e.preventDefault();
   })

}

modalGoButton.on('click', () => {
    localObj.radius = (inputRadius.val()) ? inputRadius.val() : 20;
    let coordinates = $('#coordinate-input').val().split(" ");
    if(coordinates.length > 1){
        localObj.latitude = Number(coordinates[0]);
        localObj.longitude = Number(coordinates[1]);
    }

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
             getCourse(currentId, e);
        });
    });

    $('#go').on('click', function(){
        loadScoreCard();
    });
}

function getCourse(courseId, e){
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseId, (data) => {
        currentCourse = JSON.parse(data);
        let a = $(e.target);
        a.parent().prev().text(currentCourse.course.name);
        console.log(currentCourse);

        addCardDetails();
        addTees(buttonRow, 1);
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

function addTees(elem, id){
     dropdownButton = ` <div class="dropdown" id="course-dropdown">
                               <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select Tee
                               </button>
                           <div class="dropdown-menu" id="dropdown-tees-${id}" aria-labelledby="dropdownMenuButton">
                               <!--<a class="dropdown-item" href="#">Action</a>-->
                           </div>
                       </div>`;
    let dropDownTees;

    if(!teeAdded){
        elem.append(dropdownButton);
        dropDownTees = $(`#dropdown-tees-${id}`);
        teeAdded = !teeAdded;
    }
    else{
        dropDownTees = $(`#dropdown-tees-${id}`);
        dropDownTees.empty();
    }


    dropDownTees.append('<a href="#" class="dropdown-item courses-tee-class"> Loading... </a>');

    //window.setTimeout(() => {
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
    //}, 2000);
}

function loadScoreCard(){

    for(let i in currentCourse.course.holes){
        numHoles++;
    }

    welcomeCard.hide();
    selectTeeDiv.show();
    mainHeader.show();
    scoreTable.show();
    let nameHeader = $('#course-name-header');
    nameHeader.text(currentCourse.course.name);
    teeHeader.text(currentTee);

    teeAdded = false;
    addTees(selectTeeDiv, 2);
    $('button').removeClass('btn-secondary').addClass('btn-dark');
    $('#dropdown-tees-2').on('click', 'a', function (e) {
        currentTee = $(this).text();
        updateTees(e);
    });

    addHoles();
    addPlayers();
}


function addHoles(){
    let holes = [];
    let yardage = [];
    let par = [];
    let handicap = [];


    for(let i in currentCourse.course.holes){
        holes.push(`<th scope="col">Hole ${currentCourse.course.holes[i].hole_num} </th>`);
        for(let j in currentCourse.course.holes[i].tee_boxes){
            if(currentCourse.course.holes[i].tee_boxes[j].tee_type === currentTee){
                yardage.push(`<td>${currentCourse.course.holes[i].tee_boxes[j].yards}`);
                par.push(`<td>${currentCourse.course.holes[i].tee_boxes[j].par}`);
                gPar += currentCourse.course.holes[i].tee_boxes[j].par;
                if(typeof currentCourse.course.holes[i].tee_boxes[j].hcp !=='undefined'){
                    handicap.push(`<td>${currentCourse.course.holes[i].tee_boxes[j].hcp}`);
                }
                else{
                    handicap.push(`<td>N/A</td>`);
                }
            }
        }
    }
    //yardage.reverse();
    holes.reverse();
    for(let i in currentCourse.course.holes){
        tableHeadRow.prepend(holes[i]);
        $('#yardage').append(yardage[i]);
        $('#par').append(par[i]);
        $('#handicap').append(handicap[i]);
    }

    for(let i = 0; i < 2; i++){
        parRow.append(`<td></td>`);
    }
    parRow.append(`<td>${gPar}</td>`);
    tableHeadRow.prepend(`<th scope=col"> Score Card </th>`);

}


function addPlayers() {
    for (let i = 0; i < numOfPlayers; i++) {
        tableBody.append(
            `<tr id="player${i}">
                <th scope="row">
                    <input type="text" class="player-input" placeholder="Player ${i + 1}" >
                </th>
            </tr>`);
        for(let j in currentCourse.course.holes){
            $(`#player${i}`).append(`<td><input id="score-input-${i}-${j}" class="score-input" type="number"></td>`);
            if(j == Object.keys(currentCourse.course.holes).length - 1){

                $(`#score-input-${i}-${j}`).on('input', function () {
                    console.log("I'm in the func");
                    updateScores();
                    let body = $('#score-modal-body');
                    let message;

                    if(gTotalScore[i] - gPar <= 0){
                        message = 'Excellent Game!';
                    }
                    else{
                        message = 'Good Game.';
                    }
                    if(gTotalScore[i] - gPar > 5){
                        message = "Better luck next time.";
                    }
                    message += ` Your score: ${gTotalScore[i]} Par: ${gPar}`;
                    body.text(message);

                    scoreModalButton.click();

                    $('#score-modal-button').removeClass('btn-dark').addClass('btn-primary');
                    $('#score-modal-button').trigger('focus');

                });
            }

            else{
                $(`#score-input-${i}-${j}`).on('input', updateScores);
            }
        }

        $(`#player${i}`).append(`<td id=player-in-${i}></td>`);
        $(`#player${i}`).append(`<td id=player-out-${i}></td>`);
        $(`#player${i}`).append(`<td id=player-total-${i}></td>`);

    }
}

function updateScores(){


    let numOfHoles = 0;

    for(let i in currentCourse.course.holes){
        numOfHoles++;
    }


    for(let i = 0; i < numOfPlayers; i++){
        let currentTotal = $(`#player-total-${i}`);
        let currentIn = $(`#player-in-${i}`);
        let currentOut = $(`#player-out-${i}`);

        let inScore = 0;
        let outScore = 0;
        let totalScore = 0;

        for(let j = 0; j < numOfHoles; j++){
            let currentScore = $(`#score-input-${i}-${j}`).val();
            try{
                currentScore = Number(currentScore);
                totalScore += currentScore;

                if(j + 1 <= (numOfHoles / 2)){

                    inScore += currentScore;
                }

                else if(j + 1 > (numOfHoles / 2)){
                    outScore += currentScore;
                }
            }
            catch(e){

            }
        }

        currentIn.text(inScore);
        currentOut.text(outScore);
        currentTotal.text(totalScore);
        gTotalScore[i] = totalScore;
    }
}

function updateTees(e){
    teeHeader.text(currentTee);

    let yardage = [];
    for(let i in currentCourse.course.holes){
        for(let j in currentCourse.course.holes[i].tee_boxes){
            if(currentCourse.course.holes[i].tee_boxes[j].tee_type === currentTee){
                yardage.push(`<td>${currentCourse.course.holes[i].tee_boxes[j].yards}`);
            }
        }
    }

    for(let i = 0; i < numHoles; i++){
        $('#yardage').children().last().remove();
    }

    for(let i = 0; i < numHoles; i++){
        $('#yardage').append(yardage[i]);
    }
}