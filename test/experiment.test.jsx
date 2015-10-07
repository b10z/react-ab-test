import React from "react";
import Experiment from "../src/Experiment.jsx";
import Variant from "../src/Variant.jsx";
import assert from "assert";
import co from "co";
import UUID from "node-uuid";
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

describe("Experiment", function() {
  before(function(){
    let container = document.createElement("div");
    container.id = "react";
    document.getElementsByTagName('body')[0].appendChild(container);
  });
  after(function(){
    let container = document.getElementById("react");
    document.getElementsByTagName('body')[0].removeChild(container);
  });
  it("should render the correct variant.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
  }));
  it("should error if invalid children exist.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let App = React.createClass({
      render: function(){
        return <Experiment name={experimentName} value="A">
          <Variant name="A"><div id="variant-a" /></Variant>
          <div />
        </Experiment>;
      }
    });
    try {
      yield new Promise(function(resolve, reject){
        React.render(<App />, document.getElementById("react"), resolve);
      });
    } catch(error) {
      if(error.type !== "PUSHTELL_INVALID_CHILD") {
        throw error;
      }
      return;
    }
    throw new Error("Experiment has invalid children.");
  }));
  it("should update on componentWillReceiveProps.", co.wrap(function *(){
    let experimentName = UUID.v4();
    let setState;
    let getValueA = function(){
      return "A";
    }
    let getValueB = function() {
      return "B";
    }
    let App = React.createClass({
      getInitialState: function(){
        return {
          value: getValueA
        }
      },
      componentWillMount: function(){
        setState = this.setState.bind(this);
      },
      render: function(){
        return <Experiment name={experimentName} value={this.state.value}>
          <Variant name="A"><div id="variant-a" /></Variant>
          <Variant name="B"><div id="variant-b" /></Variant>
        </Experiment>;
      }
    });
    yield new Promise(function(resolve, reject){
      React.render(<App />, document.getElementById("react"), resolve);
    });
    let elementA = document.getElementById('variant-a');
    let elementB = document.getElementById('variant-b');
    assert.notEqual(elementA, null);
    assert.equal(elementB, null);
    setState({
      value: getValueB
    });
    elementA = document.getElementById('variant-a');
    elementB = document.getElementById('variant-b');
    assert.equal(elementA, null);
    assert.notEqual(elementB, null);
  }));
});
