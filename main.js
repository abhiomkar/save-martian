var deviceWidth = $(document).width();
var svg = d3.select("svg.figure");
var originX = deviceWidth / 2;
var originY = 250;
var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
var hexValueAngleRanges = hexValues.map(function(hex) {
  return {value: hex};
});
var $hexInput = document.querySelector('.hex-input');
var $charOutput = document.querySelector('.char-output');
var $markReply = document.querySelector('.mark-reply');
var ct;

$("svg.figure").mousemove(function(e) {
  handleMouseMove(e.pageX, e.pageY);

  clearTimeout(ct);

  var x = Math.atan2(e.pageY - 250, (deviceWidth / 2) - e.pageX);
  var degree = (x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI);

  var angle = degree - 360;
  angle = Math.abs(angle);

  var hex = whichHexRange(angle);
  var lastHex;

  if (hex) {
    ct = setTimeout(function() {
      if ($hexInput.value.length === 0) {
        $hexInput.value = hex.value;
      }
      else {
        lastHex = $hexInput.value.split(" ").slice(-1)[0];
        if (lastHex.length === 2) {
          $hexInput.value += " " + hex.value;
        }
        else {
          $hexInput.value += hex.value;
        }
      }

      renderCharOut($hexInput.value);
    }, 2000);
  }

  videoCam.attr("transform", ["rotate(", angle, " ", originX, " ", originY, ")"].join(""));
});

$('.hex-input, .char-output').on('focus', function() {
  clearTimeout(ct);
});

function handleMouseMove(x, y) {
  line.attr("x2", x)
  .attr("y2", y);
}

function renderCharOut(hexInput) {
  var hex = '';
  var ascii;
  var charOut = '';

  for(var i in hexInput) {
    hex += hexInput[i];

    if (hex.length === 2) {
      ascii = parseInt(hex, 16);
      charOut += String.fromCharCode(ascii);
      hex = '';
    }
  }

  $charOutput.value = charOut;

  if (charOut.length > 5) {
    $markReply.classList.remove('hide');
  }
}

function whichHexRange(angle) {
  var result = hexValueAngleRanges.filter(function(hex) {
    if (angle >= hex.in && angle <= hex.out) {
      return true;
    }
  });

  if (result) {
    return result[0];
  }
  else {
    return false;
  }
}

circle = svg.append("circle")
.attr("cx", originX)
.attr("cy", originY)
.attr("r", 200);

outerCircle = svg.append("circle")
.attr("cx", originX)
.attr("cy", originY)
.attr("r", 220)
.attr("opacity", 0);

var hexOriginX = originX - 220;
var hexOriginY = originY;
// var hexOriginX = originX + ((220) * Math.sin(0));
// var hexOriginY = originY - ((220) * Math.cos(0));

var hexText = svg.selectAll("text")
.data(hexValues)
.enter()
.append("text");

hexText
.attr("x", hexOriginX)
.attr("y", hexOriginY)
.text(function(d, i) { return d; })
.attr("transform", function(d, i) {
  var angle = i*(360/hexValues.length);
  hexValueAngleRanges[i].in = angle - 10;
  hexValueAngleRanges[i].out = angle + 10;
  return "rotate(" + angle + "," + originX + "," + originY + ")";
});

console.log("hexValueAngleRanges: ", hexValueAngleRanges);

var videoCam = svg.append("g")
.classed({"video-cam": true});

videoCam.append("rect")
.classed({"large": true})
.attr("x", originX - 60/2)
.attr("y", originY - 30/2)
.attr("rx", 3)
.attr("ry", 3)
.attr("width", 60)
.attr("height", 30);

videoCam.append("rect")
.classed({"small": true})
.attr("x", originX - 10/2 - 36)
.attr("y", originY - 17/2)
.attr("rx", 1)
.attr("ry", 1)
.attr("width", 10)
.attr("height", 17);

videoCam.attr("transform", "rotate(45 " + originX + " " + originY + ")");

var line = svg.append("line")
.attr("x1", deviceWidth / 2)
.attr("y1", 250);
