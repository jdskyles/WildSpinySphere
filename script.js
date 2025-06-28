let activatey;
let ratey1;
let ratey2;
let ratey3;
let ratey4;
//need to have one of these const buffers per 
let context;
let ratey1slider;
let ratey2slider;
let ratey3slider;
let ratey4slider;
let gain;
let likely;
let numbox;

const { createDevice } = RNBO;

document.addEventListener('DOMContentLoaded', function(event) {
  //the event occurred
  ratey1slider = document.getElementById("ratey1");
  ratey1slider.oninput = function() {
  ratey1.value = this.value;
  }
  ratey2slider = document.getElementById("ratey2");
  ratey2slider.oninput = function() {
  ratey2.value = this.value;
  }
  ratey3slider = document.getElementById("ratey3");
  ratey3slider.oninput = function() {
  ratey3.value = this.value;
  }
    ratey4slider = document.getElementById("ratey4");
  ratey4slider.oninput = function() {
  ratey4.value = this.value;
  }
  
  numbox = document.getElementById("hello");
  numbox.oninput = function() {
  gain.value = this.value;
  console.log(this.value);
  }
  
  
})


async function setup() {
    const WAContext = window.AudioContext || window.webkitAudioContext;
    context = new WAContext();

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);
    

    // Fetch the exported patchers
    let response = await fetch("playing.export.json");
    const samplePatcher = await response.json();

    // Create the devices
    const sampleDevice = await createDevice({ context, patcher: samplePatcher });
  
    //dependency stuff
    let dependencies = await fetch("dependencies.json");
    dependencies = await dependencies.json();

    // Load the dependencies into the device
    const results = await sampleDevice.loadDataBufferDependencies(dependencies);
    results.forEach(result => {
        if (result.type === "success") {
            console.log(`Successfully loaded buffer with id ${result.id}`);
        } else {
            console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        }
    });
    //fetch params
    activatey = sampleDevice.parametersById.get("activatey");
    ratey1 = sampleDevice.parametersById.get("ratey1");
    ratey2 = sampleDevice.parametersById.get("ratey2");
    ratey3 = sampleDevice.parametersById.get("ratey3");
    ratey4 = sampleDevice.parametersById.get("ratey4");
    
    
    // Connect the devices in series
    sampleDevice.node.connect(context.destination);  
}

setup();

function play() {
  context.resume();
  activatey.value = 1;
}

function stop() {
  context.suspend();
  activatey.value = 0;
}

