import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-16';
import AppMain, { Counter, dataReducer, setList }  from './App';
import {App } from "./App";
import { add } from './App';
import { shallow, configure, mount } from "enzyme";
import renderer from 'react-test-renderer';
import axios from "axios";


configure({adapter: new Adapter()});


describe("App basic",() => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<AppMain />, div);
        ReactDOM.unmountComponentAtNode(div);
    });


    it("expects 1 + 2 equels 3", () => {
        expect(add(1, 2)).toBe(3);
    });


    it("expect to be null", () => {
       const n = null;
       expect(n).toBe(null)
    });
});


describe("Shallow component rendering", () => {
   let wrapper;
   const output = 10;
   beforeEach(() => {
      wrapper = shallow(<App output={output}/>)
   });

   it('render dumb component App', () => {
      expect(wrapper.length).toEqual(1)
   });

   it("component contains output prop", () => {
       expect(parseInt(wrapper.find("span#output").text())).toEqual(output)
   });

   it("should contain h1 hello boys", () => {
       expect(wrapper.contains(<h1>hello bous</h1>)).toBe(true)
   });

});


describe("App snapshot test", () => {
   it("app_snapshot_should_renderer", () => {
       const component  = renderer.create(<App/>);
       let tree = component.toJSON();
       expect(tree).toMatchSnapshot();
   })
});

describe("Counter snapshot test", () => {
    it("Counter spanpshot render", () => {
        const component  = renderer.create(<Counter/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })
});


describe("Reducer", () => {
  it("should set a list", () => {
        const list  = ["a", "b", "c"];
        const state = { list: [], error: null };
        const newState  = dataReducer(state, {
            type: "SET_LIST", list
        });
        expect(newState).toEqual({ list, error: null })
  });

  it("should reset error", () => {
      const list  = ["a", "b", "c"];
      const state = { list: [], error: true };
      const newState  = dataReducer(state, {
          type: "SET_LIST", list
      });
      expect(newState).toEqual({ list, error: null })
  });
  it("should set error", () => {
      const state = { list: [], error: null };
      const newState  = dataReducer(state, {
          type: "SET_ERROR"
      });
      expect(newState.error).toBeTruthy();
  });

    it("should action creator list", () => {
        const list  = ["a", "b", "c"];
        const li = setList(list);
        expect(li).toEqual({type: "SET_LIST", list})
    });

});



describe("Enzyme unit testing, Calculator", () => {
   it("Renders inner Counter", () => {
       const wrapper = mount(<App/>);
       expect(wrapper.find(Counter).length).toEqual(1)
   });

    it("Passes all props to counter", () => {
        const wrapper = mount(<App/>);
        const counterWrapper = wrapper.find(Counter);
        expect(counterWrapper.find("p").text()).toEqual("0")
    });

    it("Increment the counter", () => {
        const wrapper = mount(<App/>);
        wrapper.find("button").at(0).simulate("click");

        const counterWrapper = wrapper.find(Counter);
        expect(counterWrapper.find("p").text()).toEqual("1")
    });


    it("Decrement the counter", () => {
        const wrapper = mount(<App/>);
        wrapper.find("button").at(1).simulate("click");

        const counterWrapper = wrapper.find(Counter);
        expect(counterWrapper.find("p").text()).toEqual("-1")
    });

    it("fetching data async", done => {
       const promise = new Promise((resolve, reject) => {
           setTimeout(() => {resolve(
               {
                   data: {
                       hits: [
                           {id: 1, title: "a"},
                           {id: 2, title: "b"}
                       ]
                   }
               }
           )}, 100)
       });

       axios.get = jest.fn(() => promise)

       const wrapper = mount(<App/>);
       expect(wrapper.find("li").length).toEqual(0);

       promise.then(() => {
           setImmediate(() => {
               wrapper.update();
               expect(wrapper.find("li").length).toEqual(2);
           });
           axios.get.mockClear();

           done();
       })
    });

    it("fetching data async but fails", done => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {reject(
               new Error("Whoooops")
            )}, 100)
        });

        axios.get = jest.fn(() => promise)

        const wrapper = mount(<App/>);

        promise.catch(() => {
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find("li").length).toEqual(0);
                expect(wrapper.find(".error").length).toEqual(1);

                axios.get.mockClear();
                done();
            });
        })
    });
});


