// start slingin' some d3 here.

var width = "100%";
var height = "100%";
var collisionCount = 0;
var highScore = 0;
var currentScore = 0;
var speed = 1000;

var scoreBoard = d3.select(".scoreboard");
var body = d3.select("body");
var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;
var asteroidSize = 100;
var asteroidNum = 5;
var playerSize = 40;

var lastHit;
var playerHit = false;

var playerRotation = 0;

// Key Codes
// 38 = Up
// 40 = Down
// 37 = Left
// 39 = Right
var keyPressed = function() {
  if (window.event.keyCode === 38) {
    var data = body.select(".spaceship").data();

    if (playerRotation === 0 || playerRotation === 360) {
      data[0].y = data[0].y-5;
      if (data[0].y < 0) {
        data[0].y = bodyHeight - playerSize;
      }
    } else if (playerRotation === 90) {
      data[0].x = data[0].x+5;
      if (data[0].x > bodyWidth - playerSize) {
        data[0].x = 0;
      }
    } else if (playerRotation === 180) {
      data[0].y = data[0].y+5;
      if (data[0].y > bodyHeight - playerSize) {
        data[0].y = 0;
      }
    } else {
      data[0].x = data[0].x-5;
      if (data[0].x < 0) {
        data[0].x = bodyWidth - playerSize;
      }
    }

    body.select(".spaceship")
        .style({"top": function(d){
          return d.y + "px";
        }})
        .style({"left": function(d){
          return d.x + "px";
        }});
  }
  if (window.event.keyCode === 37) {
    playerRotation = rotatePlayer(playerRotation-90);
    body.select(".spaceship")
        .style({"-webkit-transform": "rotate("+playerRotation+"deg)"});
  }
  if (window.event.keyCode === 39) {
    playerRotation = rotatePlayer(playerRotation+90);
    body.select(".spaceship")
        .style({"-webkit-transform": "rotate("+playerRotation+"deg)"});
  }
  // console.log(window.event.keyCode);
  function rotatePlayer(val) {
    if (val < 0) val = 270;
    if (val > 360) val = 90;
    return val;
  }
}
window.onkeydown = keyPressed;

var init = function(){
  for (var i=0; i < asteroidNum; i++) {
    var x = Math.random() * bodyWidth;
    var y = Math.random() * bodyHeight;
    x = (x > bodyWidth - asteroidSize) ? bodyWidth - asteroidSize : x;
    y = (y > bodyHeight - asteroidSize) ? bodyHeight - asteroidSize : y;

    var asteroid = (i % 5) + 1;

    body.append("img")
        .data([{x: x, y: y}])
        .attr("src", "images/asteroid" + asteroid + ".png")
        .style({"left": function(d){return d.x + "px"},
                "top": function(d){return d.y + "px"},
                "width": asteroidSize + "px",
                "height": asteroidSize + "px"})
        .attr("width", asteroidSize + "px")
        .attr("height", asteroidSize + "px")
        .attr("class", "asteroid");
  }

}

var dragmove = function(d) {
  var newPos = {
    x: d3.event.x,
    y: d3.event.y
  }
  if (newPos.x < 0) {
    newPos.x = 0;
  }
  if (newPos.x > bodyWidth - playerSize) {
    newPos.x = bodyWidth - playerSize;
  }


  if (newPos.y < 0) {
    newPos.y = 0;
  }
  if (newPos.y > bodyHeight - playerSize) {
    newPos.y = bodyHeight - playerSize;
  }

  d3.select(this)
    .data([{x: newPos.x, y: newPos.y}])
    .style({"left" : newPos.x + "px",
            "top" : newPos.y + "px"});
}

var drag = d3.behavior.drag()
             .origin(Object)
             .on("drag", dragmove);

var player = body.append("img")
        .data([{x: bodyWidth/2, y: bodyHeight/2}])
        .attr("src", "images/spaceship.png")
        .style({"left": function(d){return d.x + "px"},
                "top": function(d){return d.y + "px"},
                "width": playerSize + "px",
                "height": playerSize + "px"})
        // .attr("x", function(d){return d.x;})
        // .attr("y", function(d){return d.y;})
        // .attr("width", playerSize + "px")
        // .attr("height", playerSize + "px")
        // .attr("cursor", "move")
        .attr("class", "spaceship")
        .call(drag);

var updateScore = function(){
  if (currentScore > highScore) {
    highScore = currentScore;
  }

  scoreBoard.select(".high span").text(highScore);
  scoreBoard.select(".current span").text(currentScore);
  scoreBoard.select(".collisions span").text(collisionCount);
}

var detectCollision = function(enemy){
  enemy.each(function(d){
    var enemyPos = {
      x: parseFloat(enemy.style("left")),
      y: parseFloat(enemy.style("top")),
    }
    // console.log(enemy.x + "," + enemy.y);

    var xDiff = (enemyPos.x + asteroidSize / 2) - (parseFloat(player.style("left")) + playerSize / 2);
    var yDiff = (enemyPos.y + asteroidSize / 2) - (parseFloat(player.style("top")) + playerSize / 2);
    var seperation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    var radiusSum = playerSize + asteroidSize / 2;
    if(seperation < radiusSum && lastHit !== enemy){
      collisionCount++;
      currentScore = 0;
      lastHit = enemy;
    }
  });
}


var update = function(){
  var transformPosition = [];

  for(var i = 0; i < asteroidNum; i++){
    var x = Math.random() * bodyWidth;
    var y = Math.random() * bodyHeight;
    x = (x > bodyWidth - asteroidSize) ? bodyWidth - asteroidSize : x;
    y = (y > bodyHeight - asteroidSize) ? bodyHeight - asteroidSize : y;
    transformPosition.push({x:x, y:y});
  }
  d3.selectAll(".asteroid")
  .data(transformPosition)
  .transition()
  .duration(speed)
  .tween("movingAsteroids", function(d){
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.style("left")),
      y: parseFloat(enemy.style("top"))
    }
    var time = 0;

    return function(t) {
        currentScore++;
        updateScore();
        time = 0;

      var enemyNextPos = {
        x: startPos.x + (d.x - startPos.x) * t,
        y: startPos.y + (d.y - startPos.y) * t
      }

      enemy.style({"left" : enemyNextPos.x + "px", "top" : enemyNextPos.y + "px"});

      detectCollision(enemy);
    }
  });

};


init();
setInterval(update, speed);

