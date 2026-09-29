import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  readonly isEnvelopeOpen = signal<boolean>(true);
  readonly geometryShapeIndex = signal<number>(0);

  reopenEnvelope() {
    this.isEnvelopeOpen.set(true);
  }

  closeEnvelope() {
    this.isEnvelopeOpen.set(false);
  }

  morphNextGeometry() {
    this.geometryShapeIndex.update(idx => (idx + 1) % 3);
  }
}
