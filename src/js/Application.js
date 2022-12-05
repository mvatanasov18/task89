import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    let _loading = document.body.querySelector('.progress');

    let _create = (n, t, p) => {
        const box = document.createElement("div");
        box.classList.add("box");
        box.innerHTML = this._render({
            name: n,
            terrain: t,
            population: p
        });
        document.body.querySelector(".main").appendChild(box);
    }

    let _load = async function() {
        await fetch("https://swapi.boom.dev/api/planets").then((response) => {
            if (response.status !== 200) {
                console.log('error ocured - ${response.status}');
                return;
            }

            response.json().then((data) => {
                let resultLeghth = Object.keys(data.results).length;
                let planets = [];
                for (let index = 0; index < resultLeghth; index++) {
                    let planet = {
                        'name': data.results[index].name,
                        'terrain': data.results[index].terrain,
                        'population': data.results[index].population
                    }
                    planets.push(planet);
                }
                console.log(planets);
                planets.forEach(planet => {
                    _create(planet.name, planet.terrain, planet.population);
                });
            });
        });
    }

    let _stopLoading = () => {
        _loading.style.visibility = "hidden";
    }

    function _startLoading() {
        setTimeout(function() { _load().then(() => _stopLoading()); }, 1000);
    }


    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
    _startLoading();
  }





  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}
