var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1/60; // Sensor refresh rate

function getAccel(){
    speed = { x: 0, y: 0, z: 0 }
    position = { x: 0, y: 0, z: 0 }

    data = document.getElementById("accel_data");
    data.innerText = `Getting permissions`;

    DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
       // Add a listener to get smartphone orientation 
           // in the alpha-beta-gamma axes (units in degrees)
            window.addEventListener('deviceorientation',(event) => {
                // Expose each orientation angle in a more readable way
                rotation_degrees = event.alpha;
                frontToBack_degrees = event.beta;
                leftToRight_degrees = event.gamma;
                
                // Update velocity according to how tilted the phone is
                // Since phones are narrower than they are long, double the increase to the x velocity
                vx = vx + leftToRight_degrees * updateRate*2; 
                vy = vy + frontToBack_degrees * updateRate;
                
                // Update position and clip it to bounds
                px = px + vx*.5;
                if (px > 98 || px < 0){ 
                    px = Math.max(0, Math.min(98, px)) // Clip px between 0-98
                    vx = 0;
                }

                py = py + vy*.5;
                if (py > 98 || py < 0){
                    py = Math.max(0, Math.min(98, py)) // Clip py between 0-98
                    vy = 0;
                }
                
                dot = document.getElementsByClassName("indicatorDot")[0]
                dot.setAttribute('style', "left:" + (px) + "%;" +
                                              "top:" + (py) + "%;");
                
            });

            window.addEventListener('devicemotion', (event) => {
                var v = event.acceleration;

                data = document.getElementById("accel_data");
                speed.x += (v.x) * (1/50);
                speed.y += (v.y) * (1/50);
                speed.z += (v.z) * (1/50);

                position.x += speed.x * (1/50);
                position.y += speed.y * (1/50);
                position.z += speed.z * (1/50);

                data.innerText = `${position.x} ${position.y} ${position.z}`;
            });
        }
    });
}
