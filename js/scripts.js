
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.tabs a').forEach(tab => {
    tab.addEventListener('click', () => {
      document.getElementById('active-tab-name').textContent = tab.getAttribute('data-tab-name');
    });
  });
});

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  if (evt) {
    evt.currentTarget.className += " active";
  }
}


  function storeBenchInfo() {
    var brepsElement = document.getElementById('repsbench');
    var bweightElement = document.getElementById('weightbench');
  
    var breps = brepsElement ? Number(brepsElement.value) : 0;
    var bweight = bweightElement ? Number(bweightElement.value) : 0;
  
    localStorage.setItem('breps', breps);
    localStorage.setItem('bweight', bweight);
  
    //document.getElementById('benchw').textContent = Math.round(bweight);
    //document.getElementById('benchr').textContent = Math.round(breps);
    if (breps === 1) {
      oneRM = bweight;
    } 
     else {
      oneRM = bweight * (1 + breps/30);
      
    }
  
    if (breps === 3){
      threeRM = bweight;
    } else {
      var threeRM = oneRM * (1 - (3 - 1) / 30);
    }
    
    if (breps === 5){
      fiveRM = bweight;
    } else {
      var fiveRM = oneRM * (1 - (5 - 1) / 30);
    }
    if(breps == 0){
      document.getElementById('onerepbench').textContent = Math.round(0);
      document.getElementById('threerepbench').textContent = Math.round(0);
      document.getElementById('fiverepbench').textContent = Math.round(0);
    }
    else{
      document.getElementById('onerepbench').textContent = Math.round(oneRM);
      document.getElementById('threerepbench').textContent = Math.round(threeRM);
      document.getElementById('fiverepbench').textContent = Math.round(fiveRM);
    }
    document.getElementById('benchTable').style.display = 'flex';
  }
  
  function storeSquatInfo() {
    var srepsElement = document.getElementById('repssquat');
    var sweightElement = document.getElementById('weightsquat');
  
    var sreps = srepsElement ? Number(srepsElement.value) : 0;
    var sweight = sweightElement ? Number(sweightElement.value) : 0;
  
    localStorage.setItem('sreps', sreps);
    localStorage.setItem('sweight', sweight);
  
    if (sreps === 1) {
      oneRM = sweight;
    } 
     else {
      oneRM = sweight * (1 + sreps/30);
    }
  
    if (sreps === 3){
      threeRM = sweight;
    } else {
      var threeRM = oneRM * (1 - (3 - 1) / 30);
    }
    
    if (sreps === 5){
      fiveRM = sweight;
    } else {
      var fiveRM = oneRM * (1 - (5 - 1) / 30);
    }
    if(sreps == 0){
      document.getElementById('onerepsquat').textContent = Math.round(0);
      document.getElementById('threerepsquat').textContent = Math.round(0);
      document.getElementById('fiverepsquat').textContent = Math.round(0);
    }
    else{
      document.getElementById('onerepsquat').textContent = Math.round(oneRM);
      document.getElementById('threerepsquat').textContent = Math.round(threeRM);
      document.getElementById('fiverepsquat').textContent = Math.round(fiveRM);
    }
    document.getElementById('squatTable').style.display = 'flex';
  }
  
  
  function storeDeadliftInfo() {
    var drepsElement = document.getElementById('repsdeadlift');
    var dweightElement = document.getElementById('weightdeadlift');
  
    var dreps = drepsElement ? Number(drepsElement.value) : 0;
    var dweight = dweightElement ? Number(dweightElement.value) : 0;
  
    localStorage.setItem('dreps', dreps);
    localStorage.setItem('dweight', dweight);
  
    if (dreps === 1) {
      oneRM = dweight;
    } 
     else {
      oneRM = dweight * (1 + dreps/30);
    }
  
    if (dreps === 3){
      threeRM = dweight;
    } else {
      var threeRM = oneRM * (1 - (3 - 1) / 30);
    }
    
    if (dreps === 5){
      fiveRM = dweight;
    } else {
      var fiveRM = oneRM * (1 - (5 - 1) / 30);
    }
    if(dreps == 0){
      document.getElementById('onerepdeadlift').textContent = Math.round(0);
      document.getElementById('threerepdeadlift').textContent = Math.round(0);
      document.getElementById('fiverepdeadlift').textContent = Math.round(0);
    }
    else{
      document.getElementById('onerepdeadlift').textContent = Math.round(oneRM);
      document.getElementById('threerepdeadlift').textContent = Math.round(threeRM);
      document.getElementById('fiverepdeadlift').textContent = Math.round(fiveRM);
    }
    document.getElementById('deadliftTable').style.display = 'flex';
  }
  
  
  
  function storeProfileInfo() {
    var feet = Number(document.getElementById('feet').value) || 5;
    var inches = Number(document.getElementById('inches').value) || 6;
    var height = feet * 12 + inches; // Convert height to inches
    var weight = Number(document.getElementById('weight').value) || 140;
    var experience = Number(document.getElementById('experience').value) || 0;
  
    // Store the values as numbers
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    localStorage.setItem('experience', experience);
  
    // Get the output div
    var output = document.getElementById('output');
  
    // push day
    document.getElementById('push-bench-weight').textContent = Math.round(weight * 0.8);
    document.getElementById('push-overhead-weight').textContent = Math.round(weight * 0.4);
    document.getElementById('push-chest-fly').textContent = Math.round(weight * 0.4 * 2);
    document.getElementById('push-tricep-pushdown').textContent = Math.round(weight * 0.4 * 1.5);
    //pull day
    document.getElementById('pull-bent-row').textContent = Math.round(weight * 0.6);
    document.getElementById('pull-mid-row').textContent = Math.round(weight * 0.9);
    document.getElementById('pull-pull-down').textContent = Math.round(weight * 0.7);
    document.getElementById('pull-side-delt').textContent = Math.round(weight * 0.1);
    document.getElementById('pull-front-delt').textContent = Math.round(weight * 0.1);
    //leg
    document.getElementById('leg-squat').textContent = Math.round(weight * 1.2);
    document.getElementById('leg-ext').textContent = Math.round(weight * 0.6);
    document.getElementById('leg-rdl').textContent = Math.round(weight * 0.9);
    document.getElementById('leg-raise').textContent = Math.round(weight * 0.6);
  
    //arm
    document.getElementById('bicep-curl').textContent = Math.round(weight * 0.14);
    document.getElementById('cross-curl').textContent = Math.round(weight * 0.4);
    document.getElementById('cable-curl').textContent = Math.round(weight * 0.43);
    document.getElementById('skullcrusher').textContent = Math.round(weight * 0.37);
    document.getElementById('tricep-pushdown').textContent = Math.round(weight * 0.46);
    document.getElementById('side-delt').textContent = Math.round(weight * 0.1);
    document.getElementById('front-delt').textContent = Math.round(weight * 0.1);
  
    //back
    document.getElementById('bent-row').textContent = Math.round(weight * 0.5);
    document.getElementById('mid-row').textContent = Math.round(weight * 0.42);
    document.getElementById('cable-pulldown').textContent = Math.round(weight * 0.3);
    document.getElementById('rear-delt').textContent = Math.round(weight * 0.12);
    document.getElementById('shoulder-shrug').textContent = Math.round(weight * 0.6);
  
    //chest
    document.getElementById('chest-bench-press').textContent = Math.round(weight * 0.5);
    document.getElementById('chest-cable-flys').textContent = Math.round(weight * 0.23);
    document.getElementById('chest-decline-press').textContent = Math.round(weight * 0.6);
    document.getElementById('chest-incline-press').textContent = Math.round(weight * 0.4);
  
    output.innerHTML = 'Height: ' + feet + " Feet " + inches + " Inches " + 
                       ', Weight: ' + weight + " Pounds" + 
                       ', Age: ' + experience + " Years  ";
  }
  storeProfileInfo()
  
  // MAtts Custom exercise
  function addExercise() {
    var exercise = document.getElementById('customExercise').value;
    var sets = document.getElementById('customSets').value;
    var reps = document.getElementById('customReps').value;
    var weight = document.getElementById('customWeight').value;
  
    var table = document.getElementById('customWorkoutTable');
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = exercise;
    row.insertCell(1).innerHTML = sets;
    row.insertCell(2).innerHTML = reps;
    row.insertCell(3).innerHTML = weight;
    var removeCell = row.insertCell(4);
    removeCell.innerHTML = '<button onclick="removeExercise(this)" style ="font-size: 20px;">Remove</button>';
    var burnCell = row.insertCell(5);
    burnCell.innerHTML = '<button onclick="burn()" style ="font-size: 20px;">Finished</button>';
  }
  
  function addExerciseDB(x,y,z) {
    var weight = document.getElementById('customWeight').value;
  
    var table = document.getElementById('customWorkoutTable');
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = x;
    row.insertCell(1).innerHTML = y;
    row.insertCell(2).innerHTML = z;
    row.insertCell(3).innerHTML = weight;
    var removeCell = row.insertCell(4);
    removeCell.innerHTML = '<button onclick="removeExercise(this)" style ="font-size: 20px;">Remove</button>';
    var burnCell = row.insertCell(5);
    burnCell.innerHTML = '<button onclick="burn()" style ="font-size: 20px;">Finished</button>';
  }
  
  function removeExercise(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
  
  function search() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchbox");
    filter = input.value.toUpperCase();
    table = document.getElementById("presetWorkoutTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("th")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  function calculateGoal() {
    var feet = Number(document.getElementById('feet').value) || 5;
    var inches = Number(document.getElementById('inches').value) || 6;
    var height = feet * 12 + inches; // Convert height to inches
    var weight = Number(document.getElementById('weight').value) || 140;
    var experience = Number(document.getElementById('experience').value) || 0;
  
    // Store the values as numbers
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    localStorage.setItem('experience', experience);
  
    // Use experience as age
    var age = experience;
  
    var bmr = 10 * weight + 6.25 * height - 5 * age + 5; //    equation for men
    var tdee = bmr * 1.2; // Sedentary activity level
  
    var goal = document.getElementById('goal-select').value;
    var goalCalories;
    if (goal === 'bulk') {
      goalCalories = tdee + 500; // Add 500 calories for bulking
    } else {
      goalCalories = tdee - 500; // Subtract 500 calories for cutting
    }
  
    var output = document.getElementById('goal-output');
    output.innerHTML = 'Your goal calorie intake is ' + Math.round(goalCalories) + ' calories per day' +
        ' with a weight of ' + weight + ' a height of ' + feet + " foot " + inches + " inches and age of " + age ;
  }
  
  
  function redirectToPage() {
      window.location.href = "newPage.html";
  }