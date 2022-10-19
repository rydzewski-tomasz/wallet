import { UuidGenerator } from '../../../core/uuidGenerator';
import { ExpenditureCategory } from './expenditureCategory';
import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';

export class AddExpenditureCategory {
  constructor(
    private categoryRepository: ExpenditureCategoryRepository,
    private uuidGenerator: UuidGenerator
  ) { }

  async add(categoryName: string): Promise<ExpenditureCategory> {
    const category = new ExpenditureCategory({ uuid: this.uuidGenerator.generate(), name: categoryName });
    await this.categoryRepository.save(category);
    return category;
  }
}
