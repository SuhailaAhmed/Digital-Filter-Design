let menuButton = document.querySelector(".button-menu");
let container = document.querySelector(".container");
let pageContent = document.querySelector(".page-content");
let responsiveBreakpoint = 991;
let title = document.querySelector(".site-title")

if (window.innerWidth <= responsiveBreakpoint) {
  container.classList.add("nav-closed");
}

menuButton.addEventListener("click", function () {
  title.classList.toggle("hidden")
  container.classList.toggle("nav-closed");
});

pageContent.addEventListener("click", function () {
  if (window.innerWidth <= responsiveBreakpoint) {
    container.classList.add("nav-closed");
  }
});


window.addEventListener("resize", function () {
  if (window.innerWidth > responsiveBreakpoint) {
    container.classList.remove("nav-closed");
  }
});

var $canvas = $("#zplane_polezero2");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();
var x_movement = canvasOffset.left;
var y_movement = canvasOffset.top;

const conjugateTag = document.getElementById('conjugate');
const allPassEffect = document.getElementById('allPassEffect');

// variables to save last mouse position
// used to see how far the user dragged the mouse
// and then move the text by that distance
var startX;
var startY;

var zeros = new Array;
var poles = new Array;
var allPass = new Array;
var zerosNum = 0;
var polesNum = 0;
var allPassNum = 0;

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
var num_points = 50;

slider.oninput = function () {
  output.innerHTML = this.value;
  num_points = this.value;
}


function add_a_pole() {
  points = document.getElementById("poles");
  var div = document.createElement("div");
  div.id = 'pole' + polesNum + '_polezero2';
  points.appendChild(div);
  poles.push([0, 0]);
  polesNum = polesNum + 1;
  setZplane(poles, zeros);

}

function add_a_zero() {
  points = document.getElementById("zeros");
  var div = document.createElement('div');
  div.id = 'zero' + zerosNum + '_polezero2';
  points.appendChild(div);
  zeros.push([0, 0]);
  zerosNum = zerosNum + 1;
  setZplane(poles, zeros);
}

function clear_all() {
  poles = [];
  zeros = [];
  polesNum = 0;
  zerosNum = 0;
  setZplane(poles, zeros);
}

function addNew() {
  const target = document.getElementById('allpass_lib')
  let input = document.getElementById('NewAllPassValue').value
  target.innerHTML += "<li><a href=\"#\" onclick=\"showZplaneForAllPass('" + input + "')\" ondblclick=\"addNewAllPass('" + input + "')\"><i class=\"lni lni-text-format\" ></i><span>a = " + input + "</span></a>\
        <input type=\"checkbox\" onclick=\"addOrRemove(this, '" + input + "')\"></li>";
}

function addNewAllPass(a) {
  allPass.push(math.complex(a));
  allPassNum = allPassNum + 1;
  setZplane(poles, zeros);
}

function removeAllPassFilter(a) {
  allPass = allPass.filter(function (value, index, arr) {
    return !math.equal(value, math.complex(a));
  });
  allPassNum = allPassNum - 1;
  setZplane(poles, zeros);
}

function addOrRemove(cb, a) {
  if (cb.checked) {
    addNewAllPass(a);
  }
  else {
    removeAllPassFilter(a);
  }
}

// variables for mag and phase responses
var Z = new Array(100);
var freqAxis = new Array(100);

for (let i = 0; i < 100; i++) {
  Z[i] = math.complex(math.cos(math.PI * (i / 100)), math.sin(math.PI * (i / 100)));
  freqAxis[i] = Math.PI * (i / 100);
}

var selectedPoint = -1;

function is_inside_my_box(x, y, click_index) {
  if (click_index >= polesNum) {
    return (x >= zeros[click_index - polesNum][0] - 0.2 && x <= zeros[click_index - polesNum][0] + 0.2 && y >= zeros[click_index - polesNum][1] - 0.2 && y <= zeros[click_index - polesNum][1] + 0.2);
  }
  if (click_index < polesNum) {
    return (x >= poles[click_index][0] - 0.05 && x <= poles[click_index][0] + 0.05 && y >= poles[click_index][1] - 0.05 && y <= poles[click_index][1] + 0.05);
  }
}


function handleMouseDown(e) {
  e.preventDefault();
  startX = parseInt(e.clientX - x_movement);
  startY = parseInt(e.clientY - y_movement);
  totalLength = polesNum + zerosNum;
  for (var i = 0; i < totalLength; i++) {
    if (is_inside_my_box((startX + 70) / 100, -(startY - 150) / 100, i)) {
      selectedPoint = i;
    }
  }
}


function handleMouseMove(e) {
  if (selectedPoint < 0) {
    return;
  }
  e.preventDefault();
  mouseX = parseInt(e.clientX - x_movement);
  mouseY = parseInt(e.clientY - y_movement);

  var dx = (mouseX - startX) / 100;
  var dy = -(mouseY - startY) / 100;

  startX = mouseX;
  startY = mouseY;

  if (selectedPoint >= poles.length) {
    zeros[selectedPoint - poles.length][0] += dx;
    zeros[selectedPoint - poles.length][1] += dy;
  } else if (selectedPoint < poles.length) {
    poles[selectedPoint][0] += dx;
    poles[selectedPoint][1] += dy;
  }
  setZplane(poles, zeros);
}

function handleMouseUp(e) {
  e.preventDefault();
  selectedPoint = -1;
}

function handleMouseOut(e) {
  e.preventDefault();
  selectedPoint = -1;
}

function handleMouseClick(e) {
  startX = parseInt(e.clientX - x_movement);
  startY = parseInt(e.clientY - y_movement);
  totalLength = polesNum + zerosNum;
  for (var i = 0; i < totalLength; i++) {
    if (is_inside_my_box((startX + 70) / 100, -(startY - 150) / 100, i)) {
      if (i >= polesNum) {
        zeros.splice(i - polesNum, 1);
        zerosNum = zerosNum - 1;
      } else if (i < polesNum) {
        poles.splice(i, 1);
        polesNum = polesNum - 1;
      }
    }
  }
  setZplane(poles, zeros);
}

$("#zplane_polezero2").mousedown(function (e) {
  handleMouseDown(e);
});
$("#zplane_polezero2").mousemove(function (e) {
  handleMouseMove(e);
});
$("#zplane_polezero2").mouseup(function (e) {
  handleMouseUp(e);
});
$("#zplane_polezero2").mouseout(function (e) {
  handleMouseOut(e);
});
$("#zplane_polezero2").dblclick(function (e) {
  handleMouseClick(e);
});
function setZplane(poles, zeros) {

  var radius = 100;	// radius of unit circle
  var pSize = 4;		// size of pole and zero graphic
  var zSize = 4;

  var c = document.getElementById("zplane_polezero2");
  var ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  var pad = (c.width - 2 * radius) / 2; // padding on each side

  // unit circle
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.arc(radius + pad, radius + pad, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // y axis
  ctx.beginPath();
  //ctx.lineWidth="1";
  ctx.strokeStyle = "lightgray";
  ctx.moveTo(radius + pad, 0);
  ctx.lineTo(radius + pad, c.height);
  ctx.font = "italic 8px sans-serif";
  ctx.fillText("Im", radius + pad + 2, pad - 2);

  // x axis
  ctx.moveTo(0, radius + pad);
  ctx.lineTo(c.width, radius + pad);
  ctx.fillText("Re", radius + radius + pad + 2, radius + pad - 2);
  ctx.stroke(); // Draw it

  // poles
  ctx.strokeStyle = "blue";
  var idx;
  for (idx = 0; idx < poles.length; idx++) {
    let x = radius + Math.round(radius * poles[idx][0]);
    let y = radius - Math.round(radius * poles[idx][1]);
    ctx.beginPath();
    ctx.moveTo(x - pSize + pad, y - pSize + pad);
    ctx.lineTo(x + pSize + pad, y + pSize + pad);
    ctx.moveTo(x - pSize + pad, y + pSize + pad);
    ctx.lineTo(x + pSize + pad, y - pSize + pad);
    ctx.stroke();
    if (conjugateTag.checked) {
      let x = radius + Math.round(radius * poles[idx][0]);
      let y = radius + Math.round(radius * poles[idx][1]);
      ctx.beginPath();
      ctx.moveTo(x - pSize + pad, y - pSize + pad);
      ctx.lineTo(x + pSize + pad, y + pSize + pad);
      ctx.moveTo(x - pSize + pad, y + pSize + pad);
      ctx.lineTo(x + pSize + pad, y - pSize + pad);
      ctx.stroke();
    }
  }

  // zeros
  for (idx = 0; idx < zeros.length; idx++) {
    let x = radius + Math.round(radius * zeros[idx][0]);
    let y = radius - Math.round(radius * zeros[idx][1]);
    ctx.beginPath();
    ctx.arc(x + pad, y + pad, zSize, 0, 2 * Math.PI);
    ctx.stroke();
    if (conjugateTag.checked) {
      let x = radius + Math.round(radius * zeros[idx][0]);
      let y = radius + Math.round(radius * zeros[idx][1]);
      ctx.beginPath();
      ctx.arc(x + pad, y + pad, zSize, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  if (allPassEffect.checked) {
    // allpass poles
    for (idx = 0; idx < allPass.length; idx++) {
      let x = radius + Math.round(radius * allPass[idx].re);
      let y = radius - Math.round(radius * allPass[idx].im);
      ctx.beginPath();
      ctx.moveTo(x - pSize + pad, y - pSize + pad);
      ctx.lineTo(x + pSize + pad, y + pSize + pad);
      ctx.moveTo(x - pSize + pad, y + pSize + pad);
      ctx.lineTo(x + pSize + pad, y - pSize + pad);
      ctx.stroke();
    }

    // allpass zeros
    for (idx = 0; idx < allPass.length; idx++) {
      let tempVar = math.divide(1, math.conj(allPass[idx]));
      let x = radius + Math.round(radius * tempVar.re);
      let y = radius - Math.round(radius * tempVar.im);
      ctx.beginPath();
      ctx.arc(x + pad, y + pad, zSize, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
  drawResponses();
}

function showZplaneForAllPass(a) {
  if (a != '') {
    let zero = math.divide(math.complex(1, 0), math.conj(math.complex(a)));
    let pole = math.complex(a);
    var radius = 50;	// radius of unit circle
    var pSize = 4;		// size of pole and zero graphic
    var zSize = 4;

    var c = document.getElementById("allpass_zplane_polezero2");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    var pad = (c.width - 2 * radius) / 2; // padding on each side

    // unit circle
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(radius + pad, radius + pad, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // y axis
    ctx.beginPath();
    //ctx.lineWidth="1";
    ctx.strokeStyle = "lightgray";
    ctx.moveTo(radius + pad, 0);
    ctx.lineTo(radius + pad, c.height);
    ctx.font = "italic 8px sans-serif";
    ctx.fillText("Im", radius + pad + 2, pad - 2);

    // x axis
    ctx.moveTo(0, radius + pad);
    ctx.lineTo(c.width, radius + pad);
    ctx.fillText("Re", radius + radius + pad + 2, radius + pad - 2);
    ctx.stroke(); // Draw it

    // pole
    ctx.strokeStyle = "blue";
    let x = radius + Math.round(radius * pole.re);
    let y = radius - Math.round(radius * pole.im);
    ctx.beginPath();
    ctx.moveTo(x - pSize + pad, y - pSize + pad);
    ctx.lineTo(x + pSize + pad, y + pSize + pad);
    ctx.moveTo(x - pSize + pad, y + pSize + pad);
    ctx.lineTo(x + pSize + pad, y - pSize + pad);
    ctx.stroke();

    // zero
    x = radius + Math.round(radius * zero.re);
    y = radius - Math.round(radius * zero.im);
    ctx.beginPath();
    ctx.arc(x + pad, y + pad, zSize, 0, 2 * Math.PI);
    ctx.stroke();

    drawResponseOfAllPass(a);
  }

}

function drawResponseOfAllPass(a) {
  let zero = math.divide(1, math.conj(math.complex(a)));
  let pole = math.complex(a);
  let magResponse = [];
  let phaseResponse = [];
  for (let i = 0; i < 100; i++) {
    let magPoint = math.complex(1, 0);
    let phasePoint = math.complex(1, 0);
    let temp = math.subtract(Z[i], math.complex(zero.re, zero.im));
    magPoint *= temp.abs();
    phasePoint *= temp.arg();
    temp = math.subtract(Z[i], math.complex(pole.re, pole.im));
    magPoint /= temp.abs();
    phasePoint /= temp.arg();

    magResponse.push(magPoint);
    phaseResponse.push(phasePoint);
  }

  // normalize
  var maxMag = Math.max(...magResponse);
  var maxPhase = Math.max(...phaseResponse);
  for (let i = 0; i < magResponse; i++) {
    magResponse[i] /= maxMag;
    phaseResponse[i] /= maxPhase;
  }

  let magData = [];
  let phaseData = [];

  for (let i = 0; i < 100; i++) {
    magData.push([freqAxis[i], magResponse[i]]);
    // console.log(magResponse[i]);
    phaseData.push([freqAxis[i], phaseResponse[i]]);
    // console.log(phaseResponse[i]);
  }

  // plot phase_response
  var container = document.getElementById('allpass_phase_response');
  graph = Flotr.draw(container, [phaseData], { yaxis: { max: 5, min: -5 } });
}

function drawResponses() {
  let magResponse = [];
  let phaseResponse = [];
  for (let i = 0; i < 100; i++) {
    let magPoint = math.complex(1, 0);
    let phasePoint = math.complex(1, 0);
    for (let j = 0; j < zeros.length; j++) {
      let temp = math.subtract(Z[i], math.complex(zeros[j][0], zeros[j][1]));

      magPoint *= temp.abs();
      phasePoint *= temp.arg();
    }
    if (conjugateTag.checked) {
      for (let j = 0; j < zeros.length; j++) {
        let temp_conj = math.subtract(Z[i], math.complex(zeros[j][0], -zeros[j][1]));

        magPoint *= temp_conj.abs();
        phasePoint *= temp_conj.arg();
      }

    }
    for (let j = 0; j < poles.length; j++) {
      let temp = math.subtract(Z[i], math.complex(poles[j][0], poles[j][1]));
      magPoint /= temp.abs();
      phasePoint /= temp.arg();
    }
    if (conjugateTag.checked) {
      for (let j = 0; j < poles.length; j++) {
        let temp_conj = math.subtract(Z[i], math.complex(poles[j][0], -1 * poles[j][1]));
        magPoint /= temp_conj.abs();
        phasePoint /= temp_conj.arg();
      }

    }
    if (allPassEffect.checked) {
      for (let j = 0; j < allPass.length; j++) {
        let temp = math.subtract(Z[i], math.divide(1, math.conj(allPass[j])));
        magPoint *= temp.abs();
        phasePoint *= temp.arg();
        temp = math.subtract(Z[i], allPass[j]);
        magPoint /= temp.abs();
        phasePoint /= temp.arg();
      }
    }
    magResponse.push(magPoint);
    phaseResponse.push(phasePoint);
  }




  // normalize
  var maxMag = Math.max(...magResponse);
  var maxPhase = Math.max(...phaseResponse);
  for (let i = 0; i < magResponse; i++) {
    magResponse[i] /= maxMag;
    phaseResponse[i] /= maxPhase;
  }

  let magData = [];
  let phaseData = [];

  for (let i = 0; i < 100; i++) {
    magData.push([freqAxis[i], magResponse[i]]);
    // console.log(magResponse[i]);
    phaseData.push([freqAxis[i], phaseResponse[i]]);
    // console.log(phaseResponse[i]);
  }

  // plot mag_response
  var container = document.getElementById('mag_response');
  graph = Flotr.draw(container, [magData], { yaxis: { max: 10, min: 0 } });

  // plot phase_response
  var container = document.getElementById('phase_response');
  graph = Flotr.draw(container, [phaseData], { yaxis: { max: 4, min: -4 } });
}

function multiply(a1, a2) {
  var result = [];
  a1.forEach(function (a, i) {
    a2.forEach(function (b, j) {
      result[i + j] = (result[i + j] || 0) + a * b;
    });
  });
  return result;
}

csvFileInput.addEventListener("change", (e) => {
  var dataOut_y = [];
  for (let i = 0; i < poles.length; i++) {
    console.log(poles[i][1]);
    dataOut_y.push([1, -1 * poles[i][0]]);
  }

  var data = dataOut_y, yCoeff = data.reduce(multiply)

  var dataOut_x = [];
  for (let i = 0; i < zeros.length; i++) {
    dataOut_x.push([1, -1 * zeros[i][0]]);
  }

  var data = dataOut_x, xCoeff = data.reduce(multiply);


  Papa.parse(csvFileInput.files[0], {
    delimiter: ",",
    skipEmptyLines: true,
    complete: (results) => {
      console.log(num_points);


      let i = 0;
      var Yprev = [];
      //console.log(results.data[4][0]);
      function getData() {
        i++;

        const y = results.data[i][0];

        if (i >= 9999) {
          return;
        }
        var xAdd = 0;
        var ySub = 0;

        if (i > zeros.length && i <= (zeros.length + poles.length)) {
          for (let j = 0; j < xCoeff.length; j++) {
            xAdd += xCoeff[j] * results.data[i - j - 1];
          }
          Yprev.push(xAdd);
          //console.log(xAdd);
        } else if (i > (zeros.length + poles.length)) {
          for (let j = 0; j < xCoeff.length; j++) {
            xAdd += xCoeff[j] * results.data[i - j - 1];
          }
          //console.log(xAdd);
          let n = Yprev.length;
          for (let j = 1; j < yCoeff.length; j++) {
            ySub += yCoeff[j] * Yprev[n - j]; ///rag3y rakmen 3 mn el csv then your done 
            //console.log(yCoeff[j],Yprev[n-j]);
          }
          Yprev.push(xAdd - ySub);
          //console.log(i,xAdd-ySub);
        }

        return y;
      }



      setTimeout(function () { Plotly.newPlot('chart', [{ y: [getData()], type: 'line' }]) }, 1000 / num_points);
      var cnt = 0;
      setInterval(function () {

        if (i >= 9999) {
          return;
        }
        setTimeout(function () { Plotly.extendTraces('chart', { y: [[getData()]] }, [0]) }, 1000 / num_points);
        cnt++;

        if (cnt > 500) {
          Plotly.relayout('chart', {
            xaxis: {
              range: [cnt - 500, cnt]
            }
          });
        }

      }, 15);

      ///////////new plot/////
      function getData2() {


        const y = results.data[i][0];

        if (i >= 9999) {
          return;
        }
        var xAdd = 0;
        var ySub = 0;

        if (i > zeros.length && i <= (zeros.length + poles.length)) {
          for (let j = 0; j < xCoeff.length; j++) {
            xAdd += xCoeff[j] * results.data[i - j - 1];
          }
          Yprev.push(xAdd);
          //console.log(xAdd);
        } else if (i > (zeros.length + poles.length)) {
          for (let j = 0; j < xCoeff.length; j++) {
            xAdd += xCoeff[j] * results.data[i - j - 1];
          }
          //console.log(xAdd);
          let n = Yprev.length;
          for (let j = 1; j < yCoeff.length; j++) {
            ySub += yCoeff[j] * Yprev[n - j];
          }
          Yprev.push(xAdd - ySub);

        } else {
          return;
        }
        console.log(xAdd - ySub);
        return (xAdd - ySub);
      }

      setTimeout(function () { Plotly.newPlot('chart2', [{ y: [getData2()], type: 'line' }]) }, 1000 / num_points);
      var cnt2 = 0;
      setInterval(function () {

        if (i >= 9999) {
          return;
        }
        setTimeout(function () { Plotly.extendTraces('chart2', { y: [[getData2()]] }, [0]) }, 1000 / num_points);
        cnt2++;

        if (cnt2 > 500) {
          Plotly.relayout('chart2', {
            xaxis: {
              range: [cnt2 - 500, cnt2]
            }
          });
        }

      }, 15);
    }

  });



});


setZplane(poles, zeros);
