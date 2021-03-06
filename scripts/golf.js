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
    const MILES_IN_KILOMETER = 1.60934;
    localObj.radius = (inputRadius.val()) ? inputRadius.val() * MILES_IN_KILOMETER : 20 * MILES_IN_KILOMETER;
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

    let img = new Image();
    let width;
    let height;
    let cardHeight = 246.94;
    let cardDescription = $('#welcome-card-description');


    function getImage(){
        return new Promise(resolve => {
            img.src = currentCourse.course.thumbnail;
            $(img).on('load', () => {
                width = img.width;
                height = img.height;
                let obj = {width, height};
                resolve(obj);
            });
        });
    }


    if(currentCourse.course.description){
        cardDescription.text(currentCourse.course.description);
    }
    else{
       cardDescription.text(descriptionText);
    }

    function animImage(){
        cardImage.animate({opacity: ".5"}, 100,  () => {
            cardImage.css({'max-height': '500px'});
            cardImage.attr('src', currentCourse.course.thumbnail);
            cardImage.animate({opacity: "1"}, 100);
        });
    }

    function animCard(val) {
        welcomeCard.animate({height: val}, 100, () => {
            animImage();
        });
    }

    getImage().then(obj => {
        let nextHeight = cardHeight + cardDescription.height() + obj.height - 41.9789; //just accept the magic
        let currentHeight = welcomeCard.height();

        console.log(nextHeight, currentHeight);

        if(currentHeight < nextHeight){
            animCard(`+=${nextHeight - currentHeight}px`);
        }

        else if(currentHeight > nextHeight){
            animCard(`-=${currentHeight - nextHeight}px`);
        }

    });

    $('#welcome-card-title').text(currentCourse.course.name);
}

function addTees(elem, id){
     dropdownButton = ` <div class="dropdown" id="tee-dropdown">
                               <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownTeeButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Select Tee
                               </button>
                           <div class="dropdown-menu" id="dropdown-tees-${id}" aria-labelledby="dropdownMenuButton">
                               <!--<a class="dropdown-item" href="#">Action</a>-->
                           </div>
                       </div>`;
    let dropDownTees;

    if(!teeAdded){
        let jButton = $(dropdownButton);
        jButton.css({"width" : "0"});
        elem.append(jButton);
        jButton.animate({width: "109.72"}, () => {
            teeAdded = !teeAdded;
        });
    }
    else{
    }

    dropDownTees = $(`#dropdown-tees-${id}`);
    dropDownTees.empty();


    dropDownTees.append('<a href="#" class="dropdown-item courses-tee-class"> Loading... </a>');

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
}

function fillTees(){

}

function loadScoreCard(){

    for(let i in currentCourse.course.holes){
        numHoles++;
    }

    welcomeCard.css({"position" : "relative"});
    welcomeCard.animate({right: "+=1000"}, () => {
        welcomeCard.hide();


        scoreTable.css({"position" : "relative", "left" : "+=1000"});
        scoreTable.show();
        scoreTable.animate({left: "-=1000"}, () => {
            let nameHeader = $('#course-name-header');
            nameHeader.text(currentCourse.course.name);
            teeHeader.text(currentTee);

            selectTeeDiv.show();
            teeAdded = false;
            addTees(selectTeeDiv, 2);
            $('button').removeClass('btn-secondary').addClass('btn-dark');
            $('#dropdown-tees-2').on('click', 'a', function (e) {
                currentTee = $(this).text();
                updateTees(e);
            });

            mainHeader.css({"height" : "0"});
            mainHeader.show();
            mainHeader.animate({height: "100px"});

        });

        addHoles();
        addPlayers();

    });



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
    tableHeadRow.prepend(`<th scope="col"> Score Card </th>`);

}


function addPlayers() {
    for (let i = 0; i < numOfPlayers; i++) {
        tableBody.append(
            `<tr id="player${i}">
                <th scope="row">
                    <input type="text" class="player-input" placeholder="Player ${i + 1}" >
                </th>
            </tr>`);
        let currentPlayer = $(`#player${i}`);

        for(let j in currentCourse.course.holes){
            currentPlayer.append(`<td><input id="score-input-${i}-${j}" class="score-input" type="number"></td>`);

            //keep the coalescence!!
            if(j == Object.keys(currentCourse.course.holes).length - 1){

                $(`#score-input-${i}-${j}`).on('input', function () {
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

                    scoreModalButton.removeClass('btn-dark').addClass('btn-primary');
                    scoreModalButton.trigger('focus');

                });
            }

            else{
                $(`#score-input-${i}-${j}`).on('input', updateScores);
            }
        }

        currentPlayer.append(`<td id=player-in-${i}></td>`);
        currentPlayer.append(`<td id=player-out-${i}></td>`);
        currentPlayer.append(`<td id=player-total-${i}></td>`);

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
    teeHeader.css({"position" : "relative"});
    teeHeader.animate({left: "+=300"}, () => {
        teeHeader.text(currentTee);
        teeHeader.animate({left: "-=300"});
    });

    let yardage = [];
    for(let i in currentCourse.course.holes){
        for(let j in currentCourse.course.holes[i].tee_boxes){
            if(currentCourse.course.holes[i].tee_boxes[j].tee_type === currentTee){
                yardage.push(`<td>${currentCourse.course.holes[i].tee_boxes[j].yards}</td>`);
            }
        }
    }

    for(let i = 0; i < numHoles; i++){
        $('#yardage').children().last().fadeOut().remove();
    }

    let tIncrement = 30;
    let time = 0;

    for(let i = 0; i < numHoles; i++){

        let jVar = $(`${yardage[i]}`);
        jVar.css({"max-height" : "46.98px", "height" : "46.98px", "position" : "relative", "bottom" : "20px", "opacity" : "0"});
        $('#yardage').append(jVar);
        window.setTimeout(() => {
            jVar.animate({bottom : "-=20", opacity : "1"}, "fast");
        }, time);
        time += tIncrement;
    }
}