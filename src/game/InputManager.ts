// InputManager.ts - Centralized keyboard and mouse controller for HIJACK

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  crouch: boolean;
  sprint: boolean;
  interact: boolean;
  tab: boolean;
  pause: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
}

class KeyboardMouseManager {
  private state: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    crouch: false,
    sprint: false,
    interact: false,
    tab: false,
    pause: false,
    mouseDeltaX: 0,
    mouseDeltaY: 0,
  };

  private listeners: ((state: InputState) => void)[] = [];
  private onInteractListeners: (() => void)[] = [];
  private onTabListeners: (() => void)[] = [];
  private onPauseListeners: (() => void)[] = [];

  private isPointerLocked = false;
  private isEnabled = true;

  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      if (!this.isEnabled) return;

      // Avoid default Tab focusing behavior in browser
      if (e.key === 'Tab') {
        e.preventDefault();
        this.state.tab = true;
        this.onTabListeners.forEach(cb => cb());
        return;
      }

      if (e.key === 'Escape') {
        this.state.pause = true;
        this.onPauseListeners.forEach(cb => cb());
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.state.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.state.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.state.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.state.right = true;
          break;
        case 'Space':
          this.state.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.state.sprint = true;
          break;
        case 'KeyC':
        case 'ControlLeft':
        case 'ControlRight':
          this.state.crouch = true;
          break;
        case 'KeyE':
          this.state.interact = true;
          this.onInteractListeners.forEach(cb => cb());
          break;
      }
      this.notify();
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.state.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.state.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.state.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.state.right = false;
          break;
        case 'Space':
          this.state.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.state.sprint = false;
          break;
        case 'KeyC':
        case 'ControlLeft':
        case 'ControlRight':
          this.state.crouch = false;
          break;
        case 'KeyE':
          this.state.interact = false;
          break;
        case 'Tab':
          this.state.tab = false;
          break;
      }
      this.notify();
    });

    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.state.mouseDeltaX += (e.movementX || 0);
        this.state.mouseDeltaY += (e.movementY || 0);
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = !!document.pointerLockElement;
    });
  }

  public requestPointerLock(element: HTMLElement) {
    try {
      element.requestPointerLock();
    } catch (e) {
      console.warn('Pointer lock request denied:', e);
    }
  }

  public exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  public getPointerLock(): boolean {
    return this.isPointerLocked;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetMovement();
    }
  }

  public resetMovement() {
    this.state.forward = false;
    this.state.backward = false;
    this.state.left = false;
    this.state.right = false;
    this.state.jump = false;
    this.state.crouch = false;
    this.state.mouseDeltaX = 0;
    this.state.mouseDeltaY = 0;
  }

  public consumeMouseDelta(): { x: number; y: number } {
    const delta = { x: this.state.mouseDeltaX, y: this.state.mouseDeltaY };
    this.state.mouseDeltaX = 0;
    this.state.mouseDeltaY = 0;
    return delta;
  }

  public getState(): Readonly<InputState> {
    return this.state;
  }

  public onInteract(callback: () => void) {
    this.onInteractListeners.push(callback);
    return () => {
      this.onInteractListeners = this.onInteractListeners.filter(cb => cb !== callback);
    };
  }

  public onTab(callback: () => void) {
    this.onTabListeners.push(callback);
    return () => {
      this.onTabListeners = this.onTabListeners.filter(cb => cb !== callback);
    };
  }

  public onPause(callback: () => void) {
    this.onPauseListeners.push(callback);
    return () => {
      this.onPauseListeners = this.onPauseListeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.state));
  }
}

export const InputManager = new KeyboardMouseManager();
