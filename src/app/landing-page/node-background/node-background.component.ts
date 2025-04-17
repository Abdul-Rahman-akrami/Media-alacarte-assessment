import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, NgZone, HostListener } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-node-background',
  templateUrl: './node-background.component.html',
  styleUrls: ['./node-background.component.scss']
})
export class NodeBackgroundComponent implements  AfterViewInit, OnDestroy {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private nodes: THREE.Mesh[] = [];
  private connections!: THREE.LineSegments;
  private particleSystem!: THREE.Points;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private animationId!: number;

  // Animation counters
  private linkCount = 0;
  private nodesCount = 100;
  private targetTeraflops = 4200;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    // this.initCounters();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }

  private initThreeJS(): void {

    const container = this.el.nativeElement;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.0, 1000);
    this.camera.position.set(0, 12, 25);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });


    this.renderer.setClearColor(0x000000,0)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);


    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.maxDistance = 50;
    this.controls.minDistance = 8;
    this.controls.enabled = false;

    // Nodes
    const nodeGeometry = new THREE.IcosahedronGeometry(0.35, 3);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xd9207c,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < this.nodesCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      (node as any).velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04
      );
      (node as any).rotationSpeed = (Math.random() - 0.5) * 0.02;
      (node as any).baseColor = new THREE.Color(0xd9207c);
      (node as any).hoverColor = new THREE.Color(0xef4f4f);
      (node as any).hoverState = 10;
      this.nodes.push(node);
      this.scene.add(node);
    }

    // Connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xef4f4f,
      transparent: true,
      opacity: 0.5
    });
    this.connections = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    this.scene.add(this.connections);

    // Particles
    const particleCount = 80;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 80;
      particlePositions[i + 1] = (Math.random() - 0.5) * 80;
      particlePositions[i + 2] = (Math.random() - 0.5) * 80;

      const color = Math.random() > 0.5 ? new THREE.Color(0xd9207c) : new THREE.Color(0xd9207c);
      particleColors[i] = color.r;
      particleColors[i + 1] = color.g;
      particleColors[i + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    // this.scene.add(this.particleSystem);

    // Lights
    const light1 = new THREE.PointLight(0x00ffd5, 2.5, 120);
    light1.position.set(30, 30, 30);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xff2cc4, 2.5, 120);
    light2.position.set(-30, -30, 30);
    this.scene.add(light2);

    const light3 = new THREE.PointLight(0x3a1cbd, 1.5, 150);
    light3.position.set(0, -40, -20);
    this.scene.add(light3);

    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambient);

    window.addEventListener('resize', () => this.onWindowResize());
  }


  @HostListener('window:resize')
  private onWindowResize(): void {
    console.log(window.innerWidth, window.innerHeight);
    this.handleResize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  }

  private handleResize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;

    try {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    } catch (error) {
      console.error('Error during resize:', error);
    }
  }
  @HostListener('mousemove', ['$event'])
  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const rotationSpeed = .5;
    this.controls.target.x += this.mouse.x * rotationSpeed;
    this.controls.target.y += this.mouse.y * rotationSpeed;
    this.controls.target.clamp(new THREE.Vector3(-12, -12, 0), new THREE.Vector3(12, 12, 0));
    this.camera.position.x += (this.mouse.x * 18 - this.camera.position.x) * 0.08;
    this.camera.position.y += (-this.mouse.y * 18 - this.camera.position.y) * 0.06;
    this.camera.lookAt(this.controls.target);
  }

  @HostListener('click', ['$event'])
  private onMouseClick(event: MouseEvent): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodes);
    if (intersects.length > 0) {
      const node = intersects[0].object;
      (node as any).velocity.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ));
    }
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        this.animationId = requestAnimationFrame(animateFn);
        this.updateScene();
      };
      animateFn();
    });
  }

  private updateScene(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodes);

    // Update nodes
    this.nodes.forEach(node => {
      (node as any).hoverState *= 0.9;
      node.position.add((node as any).velocity);
      node.rotation.x += (node as any).rotationSpeed;
      node.rotation.y += (node as any).rotationSpeed;

      (node.material as THREE.MeshBasicMaterial).color
        .copy((node as any).baseColor)
        .lerp((node as any).hoverColor, (node as any).hoverState);

      if (node.position.length() > 35) {
        (node as any).velocity.multiplyScalar(-0.95);
      }
    });

    // Handle hover effects
    if (intersects.length > 0) {
      const closest = intersects[0].object;
      (closest as any).hoverState = 1;
      this.nodes.forEach(node => {
        const distance = node.position.distanceTo(closest.position);
        if (distance < 6 && node !== closest) {
          (node as any).hoverState = Math.max((node as any).hoverState, 1 - (distance / 6));
        }
      });
    }

    // Update connections
    const positions: number[] = [];
    this.linkCount = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dist = this.nodes[i].position.distanceTo(this.nodes[j].position);
        if (dist < 8) {
          positions.push(
            this.nodes[i].position.x,
            this.nodes[i].position.y,
            this.nodes[i].position.z,
            this.nodes[j].position.x,
            this.nodes[j].position.y,
            this.nodes[j].position.z
          );
          this.linkCount++;
        }
      }
    }
    this.connections.geometry.dispose();
    this.connections.geometry = new THREE.BufferGeometry();
    this.connections.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Update link counter
    const linksElement = document.getElementById('links');
    if (linksElement) {
      const currentLinks = parseInt(linksElement.textContent || '0');
      if (currentLinks !== this.linkCount) {
        const newValue = currentLinks < this.linkCount ?
          Math.min(currentLinks + Math.ceil((this.linkCount - currentLinks) / 20), this.linkCount) :
          Math.max(currentLinks - Math.ceil((currentLinks - this.linkCount) / 20), this.linkCount);
        linksElement.textContent = newValue.toString();
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

}












