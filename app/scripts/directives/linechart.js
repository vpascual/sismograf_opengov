'use strict';

angular.module('sismografApp')
.directive('linechart', function () {
    return {
      //We restrict its use to an element
      //as usually  <bars-chart> is semantically
      //more understandable
      restrict: 'E',
      //this is important,
      //we don't want to overwrite our directive declaration
      //in the HTML mark-up
      replace: false, 
      // scope: { chartdata: '=' },
      // controller: 'KeywordsCtrl',
      link: function (scope, element, attrs) {
        var data = [];
        var numLines = 0;

        scope.$watch('linechartdata', function() {      
          data = scope.linechartdata;           
          if (data.length > 0) {                      
            // // console.log(d3.extent(data, function(d) { return d.date; }))
            x.domain(d3.extent(data, function(d) { return d.date; }));            
            y.domain(d3.extent(data, function(d) { return d.value; }));
            numLines++;
            draw();    
          }
        });
        
        scope.addLine = function (values) {
          console.dir(values);
          var lines = d3.selectAll(".line");
          // console.log("Lenght: " + lines.length)
          var arrivingMax = d3.max(values, function(d) { return d.value; });
          // console.log("numLines: " + numLines)
          // console.log(y.domain()[1] + " " + arrivingMax)
          var max = (numLines > 0) ? Math.max(y.domain()[1], arrivingMax) : arrivingMax;
          // console.log("max: " + max)
          y.domain([0, max]);
          numLines++;
          addLine(values);
        }

        scope.removeLine = function () {
          var lines = d3.selectAll(".line");
          lines.each(function(d, i) {
            if (i == lines.length - 1) {
              this.remove()
              numLines--;
            }
          })          
          // console.log("Queden " + numLines)
        }

        var margin = {top: 20, right: 80, bottom: 20, left: 40},
            width = 730 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // var parseDate = d3.time.format("%d-%b-%y").parse;

        var color = d3.scale.category20();

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%Y-%m-%d"))
            .ticks(d3.time.week, 14);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        var tooltip = d3.select("#tooltip");

        // var zoom = d3.behavior.zoom()
        //     .on("zoom", draw);

        var svg = d3.select(element[0])
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            // .attr("transform", "rotate(-90)")
            .attr("x", width/2)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("# canvis");

        function draw() {
          svg.select(".x")
            .transition()
            .duration(500)
            .call(xAxis);

          svg.select(".y")
            .transition()
            .duration(500)
            .call(yAxis);

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);

          var points = svg.selectAll(".point")
            .data(data)
            .enter()
              .append("svg:circle")
               // .attr("stroke", "black")
               .attr("class", "point")
               .attr("cx", function(d, i) { return x(d.date) })
               .attr("cy", function(d, i) { return y(d.value) })
               .attr("r", function(d, i) { return 3 })
                .on("mouseover", function(d) {
                  // console.log(d)
                    tooltip.html("<font size='2'>" + scope.dateFormat(d.date) + "<br>" + d.value + " canvis</font>");
                    tooltip.style("visibility", "visible");                 
                })
                .on("mousemove", function(){
                  // d3.event must be used to retrieve pageY and pageX. While this is not needed in Chrome, it is needed in Firefox
                  tooltip.style("top", (d3.event.pageY - 25)+"px").style("left",(d3.event.pageX + 5)+"px");        
                })
                .on("mouseout", function(){
                    tooltip.style("visibility", "hidden");               
                });           
        }

        function addLine(lineData) {
          svg.select(".y")
            .transition()
            .duration(500)
            .call(yAxis);

          svg.selectAll(".line")
            .transition()
            .duration(500)
            .attr("d", line)

          svg.append("path")
              .datum(lineData)
              .attr("class", "line")
              .attr("d", line)
              .style("stroke", function() {
                return color(Math.round(Math.random()*20));
              })
              .on("mouseover", function(d) {
                var currentThis = this;
                svg.selectAll(".line")
                  .style("opacity", function(d) {
                    // console.log(currentThis)
                    // console.log(currentThis)
                    if (currentThis != this)
                      return 0,5;
                    else
                      return 1;
                  })

              });
        }

      }
  }
});
