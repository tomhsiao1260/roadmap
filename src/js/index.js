import * as d3 from 'd3';
import '../style/style.scss';
import '../style/clear.scss';
import treeData from '../data.json';
import Description from './description';
import list from '../description.json';

// size of the treemap
const width = 1000;
const height = 6000;
const treemap = d3.tree().size([height, width]);

// some parameters deal with size, position, animation time
const shiftX = 330;
const shiftY = 15;
const duration = 1000;
// box size (px) for each treemap level: [root, level1, level2, level3]
const wBox = [100, 140, 300, 100];
let i = 0;

const roadmap = d3.select('.container').append('div')
                .attr('class', 'roadmap');

const svg = roadmap.append('svg');

Description();

const root = d3.hierarchy(treeData);
root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse);

update(root);

const btn = document.querySelector('.clear');
btn.addEventListener('click', clear);
btn.addEventListener('mouseover', showText);
btn.addEventListener('mouseout', fadeText);

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
function collapse(d) {
    // collapse all nodes
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}
/* eslint-enable no-param-reassign */

// update the state of the treemap
function update(source) {
    const treeData = treemap(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);
    /* eslint-disable-next-line no-param-reassign */
    nodes.forEach((d) => { d.y = d.depth * shiftX; });
    const node = roadmap.selectAll('div.node')
                        .data(nodes, (d) => {
                          /* eslint-disable-next-line no-param-reassign */
                          if (!d.id) { i += 1; d.id = i; }
                          return d.id;
                        });
    // add click event, name on each node
    const nodeEnter = node.enter().append('div')
                        .attr('class', (d) => `node level${d.depth}`)
                        .text((d) => d.data.name)
                        .style('transform', `translateX(${source.y0 - shiftX}px) 
                                             translateY(${source.x0 - shiftY}px)`)
                        .on('click', click);
    // add dot to the upper left of the specified node
    // the color of the dot is based on description.js file
    nodeEnter.append('span')
              .attr('class', 'dot')
              .style('position', 'absolute')
              .style('top', '-8px')
              .style('left', '-20px')
              .style('transform', `translateX(${15}px) translateY(${3}px)`)
              .style('display', (d) => {
                if (!d.data.mode) { return 'none'; }
                return 'block';
              })
              .style('background-color', (d) => {
                if (d.data.mode) { return list[d.data.mode - 1].color; }
                return 'transparent';
              });
    // If the node has not been expanded, it will be grayed out
    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition()
              .duration(duration)
              .style('cursor', 'pointer')
              .style('transform', (d) => `translateX(${d.y - shiftX}px) 
                                          translateY(${d.x - shiftY}px)`)
              /* eslint-disable consistent-return */
              .style('color', (d) => { if (d._children) { return 'white'; } })
              .style('background-color', (d) => { if (d._children) { return 'gray'; } });
              /* eslint-enable-next-line consistent-return */
    // handling node exit
    const nodeExit = node.exit().transition()
        .duration(duration)
        .style('width', '0px')
        .style('height', '0px')
        .style('opacity', 0)
        .style('transform', `translateX(${source.y - shiftX}px) 
                             translateY(${source.x - shiftY}px)`)
        .remove();
    nodeExit.select('div.node')
            .style('fill-opacity', 1e-6);
    // process the path between each node
    const link = svg.selectAll('path.link')
                  .data(links, (d) => d.id);

    const linkEnter = link.enter().append('path')
                        .attr('class', 'link')
                        .attr('d', (d) => {
                            const o = { x: source.x0, y: source.y0 };
                            return diagonal(o, o, d.depth);
                        });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
              .duration(duration)
              .attr('d', (d) => diagonal(d, d.parent, d.depth));
    /* eslint-disable-next-line no-unused-vars */
    const linkExit = link.exit().transition()
                         .duration(duration)
                         .attr('d', (d) => {
                            const o = { x: source.x, y: source.y };
                            return diagonal(o, o, d.depth);
                         })
                         .remove();
    /* eslint-disable no-param-reassign */
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    /* eslint-enable no-param-reassign */
}

// generate a path connecting each node (box)
function diagonal(s, d, depth) {
  const dd = wBox[depth - 1];

  const path = `M ${s.y - shiftX} ${s.x}
                C ${(s.y + d.y + dd) / 2 - shiftX} ${s.x},
                ${(s.y + d.y + dd) / 2 - shiftX} ${d.x},
                ${d.y + dd - shiftX} ${d.x}`;

  return path;
}

// decide whether to expand or collapse the node
/* eslint-disable no-param-reassign */
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
/* eslint-enable no-param-reassign */

// clear the treemap when the dust ball character is clicked
function clear(e) {
  root.children.forEach(collapse);
  update(root);
  const dust = e.currentTarget;
  const clearText = btn.querySelector('div:last-child');
  // handling mobile device click events
  if (dust.classList.contains('active')) {
    dust.classList.remove('active');
    clearText.style.display = 'none';
  } else {
    dust.classList.add('active');
    clearText.style.display = 'block';
  }
}

// handling clear text display
function showText() {
  const clearText = btn.querySelector('div:last-child');
  clearText.style.display = 'block';
}
function fadeText() {
  const clearText = btn.querySelector('div:last-child');
  clearText.style.display = 'none';
}
