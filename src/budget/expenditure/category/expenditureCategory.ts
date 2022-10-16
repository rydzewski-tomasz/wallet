
export class ExpenditureCategory {
  constructor(
    private uuid: string,
    private name: string
  ) { }

  update(input: { name: string }) {
    this.name = input.name;
  }

  toSnapshot() {
    return {
      uuid: this.uuid,
      name: this.name
    }
  }
}
