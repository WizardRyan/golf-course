
//let dropDownTees = $('#dropdown-tees');

let cardImage = $('.card-img-top');

let descriptionText= 'Select a course, the number of players this game, and then your preferred tee type. When you\'re satisfied with your selections, hit \'Go\'.';

let dropdownButton;

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