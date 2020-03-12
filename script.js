var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
},
width = 840,
    height = 600;
var kx = function (d) {
    return d.x - 20;
};
var ky = function (d) {
    return d.y - 10;
};
//thie place the text x axis adjust this to center align the text
var tx = function (d) {
    return d.x - 3;
};
//thie place the text y axis adjust this to center align the text
var ty = function (d) {
    return d.y + 3;
};
//make an SVG
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//My JSON note the 
//no_parent: true this ensures that the node will not be linked to its parent
//hidden: true ensures that the nodes is not visible.
var root = 
{
    name: "Chaos",
    id: 1,
    no_parent: true,
    children: [
    {
        name: "Tartarus",
        id: 2
    },{
        name: "Gaia",
        id: 3,
        children: [
        {
            name: "The Nesoi",
            id: 7,
        },{
            name: "Ourea",
            id: 8
        },{
            name: "Pontus",
            id: 9
        },{
            name: "Uranus",
            id: 10
        }]
    },{
        name: "Eros",
        id: 4
    },{
        name:"Erebus",
        id: 5
    },{
        name: "Nyx",
        id: 6
    }]
};

var allNodes = flatten(root);

// Compute the layout.
var tree = d3.layout.tree().size([width, height]),
    nodes = tree.nodes(root),
    links = tree.links(nodes);

// Create the link lines.
svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", elbow);


var nodes = svg.selectAll(".node")
    .data(nodes)
    .enter();

// //First draw sibling line with blue line
// svg.selectAll(".sibling")
//     .data(siblings)
//     .enter().append("path")
//     .attr("class", "sibling")
//     .attr("d", sblingLine);

// Create the node rectangles.
nodes.append("rect")
    .attr("class", "node")
    .attr("height", 20)
    .attr("width", 40)
    .attr("id", function (d) {
    return d.id;
})
    .attr("display", function (d) {
    if (d.hidden) {
        return "none"
    } else {
        return ""
    };
})
    .attr("x", kx)
    .attr("y", ky);
// Create the node text label.
nodes.append("text")
    .text(function (d) {
    return d.name;
})
    .attr("x", tx)
    .attr("y", ty);


/**
This defines teh line between siblings.
**/
function sblingLine(d, i) {
    //start point
    var start = allNodes.filter(function (v) {
        if (d.source.id == v.id) {
            return true;
        } else {
            return false;
        }
    });
    //end point
    var end = allNodes.filter(function (v) {
        if (d.target.id == v.id) {
            return true;
        } else {
            return false;
        }
    });
    //define teh start coordinate and end co-ordinate
    var linedata = [{
        x: start[0].x,
        y: start[0].y
    }, {
        x: end[0].x,
        y: end[0].y
    }];
    var fun = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("linear");
    return fun(linedata);
}

/*To make the nodes in flat mode.
This gets all teh nodes in same level*/
function flatten(root) {
    var n = [],
        i = 0;

    function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        n.push(node);
    }
    recurse(root);
    return n;
}
/** 
This draws the lines between nodes.
**/
function elbow(d, i) {
    if (d.target.no_parent) {
        return "M0,0L0,0";
    }
    var diff = d.source.y - d.target.y;
    //0.40 defines the point from where you need the line to break out change is as per your choice.
    var ny = d.target.y + diff * 0.40;

    linedata = [{
        x: d.target.x,
        y: d.target.y
    }, {
        x: d.target.x,
        y: ny
    }, {
        x: d.source.x,
        y: d.source.y
    }]

    var fun = d3.svg.line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).interpolate("step-after");
    return fun(linedata);
}