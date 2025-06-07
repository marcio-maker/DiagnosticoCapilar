document.addEventListener('DOMContentLoaded', () => {
  // Configuração da cena
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('threejs-bubbles').appendChild(renderer.domElement);

  // Posicionamento da câmera
  camera.position.z = 30;

  // Array de bolhas
  const bubbles = [];
  const colors = [0xff6b6b, 0x4ecdc4, 0x45aaf2, 0xa55eea, 0xf7b731];

  // Criar bolhas
  function createBubble() {
    const geometry = new THREE.SphereGeometry(
      Math.random() * 2 + 1, // Raio aleatório (1-3)
      32, 
      32
    );
    
    const material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const bubble = new THREE.Mesh(geometry, material);
    
    // bubbles.js - Adicione isso na função createBubble()
bubble.userData.originalColor = bubble.material.color.clone(); 

// Efeito hover sutil
renderer.domElement.addEventListener('mousemove', (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bubbles);
  
  bubbles.forEach(bubble => {
    if (intersects.length > 0 && intersects[0].object === bubble) {
      bubble.material.color.lerp(new THREE.Color(0xffffff), 0.1); // Brilha ao passar o mouse
    } else {
      bubble.material.color.lerp(bubble.userData.originalColor, 0.05); // Volta à cor original
    }
  });
});

    // Posição aleatória
    bubble.position.x = (Math.random() - 0.5) * 50;
    bubble.position.y = (Math.random() - 0.5) * 50;
    bubble.position.z = (Math.random() - 0.5) * 50;
    
    // Velocidade aleatória
    bubble.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    );

    scene.add(bubble);
    bubbles.push(bubble);
  }

  // Criar 30 bolhas
  for (let i = 0; i < 30; i++) {
    createBubble();
  }

  // Adicionar luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Animação
  function animate() {
    requestAnimationFrame(animate);
    
    bubbles.forEach(bubble => {
      // Movimento
      bubble.position.add(bubble.velocity);
      
      // Rebater nas bordas
      if (Math.abs(bubble.position.x) > 25) bubble.velocity.x *= -1;
      if (Math.abs(bubble.position.y) > 25) bubble.velocity.y *= -1;
      if (Math.abs(bubble.position.z) > 25) bubble.velocity.z *= -1;
    });

    renderer.render(scene, camera);
  }
  animate();

  // Interação - Explodir bolhas ao clicar
  function onMouseClick(event) {
    // Coordenadas normalizadas (-1 to 1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(bubbles);
    
    if (intersects.length > 0) {
      const bubble = intersects[0].object;
      
      // Animação de explosão
      const explosionGeometry = new THREE.SphereGeometry(1, 32, 32);
      const explosionMaterial = new THREE.MeshBasicMaterial({
        color: bubble.material.color,
        transparent: true,
        opacity: 0.6
      });
      
      const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
      explosion.position.copy(bubble.position);
      scene.add(explosion);
      
      // Remover bolha original
      scene.remove(bubble);
      bubbles.splice(bubbles.indexOf(bubble), 1);
      
      // Animação de expansão
      let scale = 1;
      const explodeInterval = setInterval(() => {
        scale += 0.2;
        explosion.scale.set(scale, scale, scale);
        explosionMaterial.opacity -= 0.02;
        
        if (explosionMaterial.opacity <= 0) {
          clearInterval(explodeInterval);
          scene.remove(explosion);
          createBubble(); // Adiciona nova bolha
        }
      }, 16);
    }
  }

  window.addEventListener('click', onMouseClick, false);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});