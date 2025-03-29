let scene, camera, renderer, composer;
let clock = new THREE.Clock();
function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Post-processing setup
    composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    // Add a shader pass for color bleeding
    const shaderPass = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    shaderPass.uniforms['h'].value = 1 / window.innerWidth;
    composer.addPass(shaderPass);

    const shaderPassVertical = new THREE.ShaderPass(THREE.VerticalBlurShader);
    shaderPassVertical.uniforms['v'].value = 1 / window.innerHeight;
    composer.addPass(shaderPassVertical);
    // Create a plane with a texture
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Animation loop
    animate()
}

function animate() {
    requestAnimationFrame(animate);
    
    // Create moving bands of interference
    const time = clock.getElapsedTime();
    scene.children[0].material.color.setHSL((Math.sin(time) + 1) / 2, 1, 0.5);
    // Render the scene with post-processing
    composer.render();
}
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

init();
