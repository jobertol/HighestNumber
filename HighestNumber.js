var inBox, submit, numBox,highScores;
var maxVal = 10000;

var badChar = ['\\', '#', '&', '%', '<', '=', ';', ':', '/', '>'];

var database, ref;

function setup() {
  createCanvas(200, 500);
  background('#444444');

  numBox = createInput('0', 'number');
  numBox.size(100, 20);
  numBox.position(null, 200);
  numBox.center('horizontal');
  numBox.style('text-align', 'center');
  numBox.attribute('min', '0');
  numBox.attribute('max', str(maxVal));

  inBox = createInput('Full Name', 'text');
  inBox.size(100, 20);
  inBox.position(null, 170);
  inBox.center('horizontal');
  inBox.style('text-align', 'center');

  submit = createButton('Submit');
  submit.size(75, 20);
  submit.position(null, 230);
  submit.center('horizontal');
  submit.mousePressed(submitScore);

  highScores = createElement('ol');
  highScores.position(35, 0);
  highScores.style('text-align', 'center');
  highScores.style('list-style-position', 'inside');
  highScores.style('width', '100');
  highScores.style('color', '#FFF');
  highScores.style('font-family', 'sans-serif');

  //Firebase API
  var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  ref = database.ref("scores/");
  firebase.analytics();

  //Load Highscores
  ref.once('value', gotData, errData);
}

function draw() {
  //Set Refresh Rate
  frameRate(1);
  //Load Highscores
  ref.once('value', gotData, errData);
}

function submitScore() {
  //Upload user input if valid
  ref.once('value', check, errData);

  inBox.hide();
  numBox.hide();
  submit.hide();
}

function check(data) {
  //Checks if the number is a number
  if (isNaN(numBox.value())) {
    console.log('P');
    alert('hEY stop that');
  } else {
    var cont = 1;
    var push = 1;

    var fetched = data.val();
    var keys = Object.keys(fetched);

    //Removes decimals and sets bounds
    var num = floor(float(numBox.value()));
    num = constrain(num, 0, maxVal);

    //Limits name string length
    var myName = inBox.value().substring(0, min(inBox.value().length, 20));

    //Checks for banned characters
    //Stops JS injection
    for (var j = 0; j < myName.length; j++) {
      var temp = myName.substring(j, j + 1);

      if (badChar.indexOf(temp) > -1) {
        console.log('F');
        alert('hEY stop that');
        cont = 0;
        break;
      }
      if (temp >= '0' && temp <= '9') {
        console.log('f');
        alert('hEY stop that');
        cont = 0;
        break;
      }
    }


    if (cont) {
      //Check if the number is a duplicate
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var submittedScore = fetched[k].number;
        var fr = fetched[k].freq;
        if (submittedScore == num) {
          ref.child(k).update({
            freq: (fr + 1)
          });
          push = 0;
          break;
        }
      }
      if (push) {
        //Create JSON Payload
        var d = {
        name: myName,
        number: num,
        freq: 1
      }
        //Push new data
        ref.push(d);
      }
    }
  }
}


function gotData(data) {
  //Clears the Highscore ol
  var scoreListings = selectAll('.scoreListing');
  for (var i = 0; i < scoreListings.length; i++) {
    scoreListings[i].remove();
  }

  var scores = data.val();
  var keys = Object.keys(scores);

  //Creates array for sorting
  var toSort = [];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    ref.child(keys[i]).child('order').remove();
    var submittedScore = constrain(scores[k].number, 0, maxVal);
    var submittedName = scores[k].name.substring(0, min(scores[k].name.length, 20));
    var submittedF = scores[k].freq;
    var temp = [submittedName, submittedScore, submittedF];
    toSort.push(temp);
  }

  //Checks for unwanted data since database is unsecured
  for (var i = 0; i < toSort.length; i++) {
    if (toSort[i][0].indexOf('<') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('=') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('/') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('#') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf(';') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf(':') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('%') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('&') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0].indexOf('\\') > -1) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (toSort[i][0] == "") {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (isNaN(toSort[i][1])) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
    if (isNaN(toSort[i][2])) {
      console.log(toSort[i][0]);
      ref.child(keys[i]).remove();
      toSort[i].remove();
    }
  }


  var sorted = toSort.sort(function(a, b) {
    return b[1] - a[1]
  });

  var j = 0;

  for (var i = 0; i < sorted.length; i++) {
    if (j > 4) {
      break;
    }
    if (sorted[i][2] < 2) {
      if (sorted[i][0].indexOf('/') < 0) {
        var li = createElement('li', sorted[i][0]);
        li.class('scoreListing');
        li.parent(highScores);
        j++;
      }
    }
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

/*
"$user_id":{
  "number":{
    ".write": "(newData.isNumber() && (newData.val() <= 10000) && (newData.val() >= 0))
      || (newData.val() == null)"
  },
  "name":{
    ".write" : true,
  },
  "freq":{
    ".write" : "newData.isNumber() && (newData.val() <= 100) && (newData.val() >= 0)
      || (newData.val() == null)",
  }
}
*/
