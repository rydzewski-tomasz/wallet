
export abstract class Entity {
  protected readonly uuid: string;

  protected constructor({ uuid }: { uuid: string }) {
    this.uuid = uuid;
  }

  equals(object: Entity): boolean {
    return this.uuid === object.uuid;
  }
}
