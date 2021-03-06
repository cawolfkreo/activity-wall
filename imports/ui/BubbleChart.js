import React, {Component} from "react";
import * as d3 from "d3";
import { scaleOrdinal, schemeCategory20c } from 'd3-scale';
import {Meteor} from 'meteor/meteor';
import {Switch, Route} from 'react-router-dom'

import CreateEvent from "./CreateEvent";
import Wall from "./Wall";

class BubbleChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){

        const svg = d3.select(this.svg);
        this.width = +svg.attr("width");
        this.height = +svg.attr("height");

        this.format = d3.format(",d");

        this.color = d3.scaleOrdinal(d3.schemeCategory20c);

        this.pack = d3.pack()
            .size([this.width, this.height])
            .padding(1.5);


        //this.update(this.props);

    }

    componentWillUpdate(newProps){

        this.update(newProps);
    }

    update (props){


        //console.log("Update", props);
        //console.log("State", this.svg);
        console.log(props);
        if (!props.users || props.users.length === 0) return ;

        //const data = props.users;
        var root = d3.hierarchy({children: props.users})
            .sum(function(d) { return d.rts; })
            .each(function(d) {
                if (name = d.data.screenname) {
                    var name, i = name.lastIndexOf(".");
                    d.screenname = name;
                    d.package = name.slice(0, i);
                    d.class = name.slice(i + 1);
                }
            });

        var svg = d3.select(this.svg);

        var node = svg.selectAll(".node")
            .data(this.pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + parseInt((d.x)-70) + "," + parseInt((d.y)-60) + ")"; });

        node.append("circle")
            .attr("id", function(d) { return d.screenname; })
            .attr("r", function(d) { return d.r; })
            .style("fill", (d) => { return this.color(d.package); });

        node.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.screenname; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.screenname; });

        node.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.screenname + ")"; })
            .selectAll("tspan")
            .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
            .text(function(d) { return d; });

        node.append("title")
            .text((d) => { return d.screenname + "\n" + this.format(d.data.rts); });

    }

    render() {
        return (
            <div className="bubbleChart">
                <svg
                    width="600"
                    height="400"
                    ref={(svg) => this.svg = svg}>
                </svg>
            </div>
        );
    }
}

export default BubbleChart;