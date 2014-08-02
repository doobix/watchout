// start slingin' some d3 here.

var width = "100%";
var height = "100%";
var collisionCount = 0;

var svg = d3.select("body").append("svg")
            .attr("width", width).attr("height", height);

var bodyWidth = parseInt(d3.select("body").style("width"));
var bodyHeight = parseInt(d3.select("body").style("height"));
var asteroidSize = 200;
var asteroidNum = 1;
var playerSize = 10;
var playerCol = "green";

var dragmove = function(d) {
  player.attr("cx", d.x = d3.event.x)
        .attr("cy", d.y = d3.event.y);
}

var drag = d3.behavior.drag()
             .origin(Object)
             .on("drag", dragmove);

var newg = svg.append("g")
              .data([{x: bodyWidth/2, y: bodyHeight/2}]);


var player = newg.append("circle")
  .attr("cx", function(d){return d.x;})
  .attr("cy", function(d){return d.y;})
  .attr("r", playerSize)
  .attr("fill", playerCol)
  .attr("cursor", "move")
  .call(drag);

var detectCollision = function(){
  var enemies = d3.selectAll('.asteroid');
    enemies.each(function(d){
        console.log(d[0] + "," + d[1]);

      var xDiff = (d[0] + asteroidSize / 2)- player.attr("cx");
      var yDiff = (d[1] + asteroidSize / 2)- player.attr("cy");
      var seperation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      var radiusSum = playerSize + asteroidSize / 2;
      if(seperation < radiusSum){
        collisionCount++;
        console.log(collisionCount);
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
    transformPosition.push([x, y]);
  }
  d3.selectAll("image")
  .data(transformPosition)
  .transition()
  .tween("movingAsteroids", function(endData){
    d3.select(this)
      .transition()
      .duration(1000)
      .attr("x", endData[0])
      .attr("y", endData[1]);

      return detectCollision();
  });

};

var init = function(){
  for (var i=0; i < asteroidNum; i++) {
    var x = Math.random() * bodyWidth;
    var y = Math.random() * bodyHeight;
    x = (x > bodyWidth - asteroidSize) ? bodyWidth - asteroidSize : x;
    y = (y > bodyHeight - asteroidSize) ? bodyHeight - asteroidSize : y;

    d3.select("svg").append("image")
      .attr("xlink:href", "asteroid.png")
      .data([{x: x, y: y}])
      .attr("x", function(d){return d.x;})
      .attr("y", function(d){return d.y;})
      .attr("width", asteroidSize + "px")
      .attr("height", asteroidSize + "px")
      .attr("class", "asteroid");
  }

}

init();
setInterval(update, 1000);

