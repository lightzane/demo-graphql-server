import type { BookShelfModel } from '../models';
import mocks from './mocks';

export class BookShelfAPI {
  get(): BookShelfModel[];
  get(shelfId: string): BookShelfModel | null;
  get(shelfId?: string): BookShelfModel[] | BookShelfModel | null {
    if (shelfId) {
      return mocks.bookShelves.find((shelf) => shelf.id === shelfId) ?? null;
    }

    return mocks.bookShelves;
  }

  addLabel(shelfId: string, label: string): BookShelfModel | null {
    const shelf = this.get(shelfId);

    if (!shelf || !label.trim()) {
      return null;
    }

    const newLabel: BookShelfModel['labels'][number] = {
      id: 0, // Assuming ID is auto-generated or managed elsewhere
      name: label.trim(),
    };

    if (shelf.labels.some((l) => l.name === newLabel.name)) {
      return shelf; // Label already exists, return the shelf without changes
    }

    // Insert new label
    shelf.labels.push(newLabel);

    // Simple ID assignment based on length
    newLabel.id = shelf.labels.length;

    return shelf;
  }
}
