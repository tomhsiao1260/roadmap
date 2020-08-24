import * as d3 from "d3";
import "../style/style.css";
import treeData from '../data.json';
import Description from './description';
import list from '../description.json'

var width = 1000;
var height = 6000;
var treemap = d3.tree().size([height, width]);

var shiftX = 330;
var shiftY = 15;
var duration = 750;
var w_box = [100, 140, 300, 100];
var i = 0;

var note    = d3.select(".container").append("div")
                .attr("class", "note");

var roadmap = d3.select(".container").append("div")
                .attr("class", "roadmap");

var svg     = roadmap.append("svg");

Description();

var root = d3.hierarchy(treeData);
root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse);

update(root);

function collapse(d) {
    if(d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function update(source) {

    var treeData = treemap(root);
  
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);
  
    nodes.forEach(function(d){ d.y = d.depth * shiftX});
  
    var node = roadmap.selectAll('div.node')
                      .data(nodes, d => (d.id || (d.id = ++i)));
  
    var nodeEnter = node.enter().append('div')
                        .attr("class", d => `node level${d.depth}`)
                        .text( d => d.data.name )
                        .style("transform", d => `translateX(${source.y0 - shiftX}px) 
                                                  translateY(${source.x0 - shiftY}px)`)
                        .on('click', click);

    nodeEnter.append('span')
              .attr("class", "dot")
              .style("position", "absolute")
              .style("top", "-8px")
              .style("left", "-20px")
              .style("transform", d => `translateX(${15}px) 
                                        translateY(${3}px)`)
              .style("display", d => {
                if(!d.data.mode){return 'none'}
              })
              .style("background-color", d => {
                if(d.data.mode){return list[d.data.mode-1].color;}
              });
  
    var nodeUpdate = nodeEnter.merge(node);
  
    nodeUpdate.transition()
              .duration(duration)
              .style('cursor', 'pointer')
              .style("transform", d => `translateX(${d.y - shiftX}px) 
                                        translateY(${d.x - shiftY}px)`)
              .style("color", d => { if(d._children){ return 'white' }})
              .style("background-color", d => { if(d._children){ return 'gray' }});
  
    var nodeExit = node.exit().transition()
        .duration(duration)
        .style("width","0px")
        .style("height","0px")
        .style("transform", d => `translateX(${source.y - shiftX}px) 
                                  translateY(${source.x - shiftY}px)`)
        .remove();
  
    nodeExit.select('div.node')
            .style('fill-opacity', 1e-6);
  
    var link = svg.selectAll("path.link")
                  .data(links, d => d.id)

    var linkEnter = link.enter().append("path")
                        .attr("class", "link")
                        .attr('d', function(d){
                            var o = {x: source.x0, y: source.y0}
                            return diagonal(o, o, d.depth);
                        });

    var linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
              .duration(duration)
              .attr('d', d => diagonal(d, d.parent, d.depth));

    var linkExit = link.exit().transition()
                       .duration(duration)
                       .attr('d', function(d) {
                            var o = {x: source.x, y: source.y}
                            return diagonal(o, o, d.depth)
                        })
                       .remove();
  
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });
  
    function diagonal(s, d, depth) {

        let dd = w_box[depth-1];
      
        let path = `M ${s.y - shiftX} ${s.x}
                    C ${(s.y + d.y + dd) / 2 - shiftX} ${s.x},
                      ${(s.y + d.y + dd) / 2 - shiftX} ${d.x},
                      ${d.y + dd - shiftX} ${d.x}`;
    
        return path;
    }
  
    function click(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      update(d);
    }
  }

